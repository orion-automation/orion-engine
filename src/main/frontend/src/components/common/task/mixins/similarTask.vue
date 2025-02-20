<template>
  <div />
</template>

<script>
import taskRequest from "@/api/task";
import processRequest from "@/api/process";
import debounce from "lodash/debounce";
import InfiniteLoading from "vue-infinite-loading";

export default {
  name: "SimilarTask",
  components: { InfiniteLoading },
  data() {
    this.onSearchSimilarTask = debounce(this.onSearchSimilarTask, 800);
    return {
      similarTask: {
        current: {},
        display: false,
        items: [],
        pageSize: 10,
        pageOffset: 0,
        filter: {
          searchVal: ""
        },
        infiniteId: +new Date(),
        loading: false
      },
      userId: this.$store.state.user.profile.id,
      tenantId: this.$store.getters["user/getTenant"].id
    };
  },
  methods: {
    onSearchSimilarTask() {
      let self = this;
      self.similarTask.items = [];
      self.similarTask.infiniteId += 1;
    },
    async getSimilarTask($state) {
      let self = this;
      try {
        let reqData = {};
        if (self.similarTask.filter.searchVal) {
          reqData["orQueries"] = [
            {
              processInstanceBusinessKeyLike: `%${self.similarTask.filter.searchVal}%`,
              processDefinitionNameLike: `%${self.similarTask.filter.searchVal}%`
            },
            {
              assignee: self.userId
            },
            {
              taskDefinitionKey: self.task.taskDefinitionKey,
              processInstanceId:self.task.processInstanceId,
            }
          ];
        } else {
          reqData["orQueries"] = [
            {
              processInstanceId:self.task.processInstanceId,
              taskDefinitionKey: self.task.taskDefinitionKey
            },
            {
              assignee:self.userId,
            }
          ];
        }
        if (self.similarTask.items.length === 0) {
          self.pageOffset = 0;
        }
        reqData["sorting"] = [{ sortBy: "dueDate", sortOrder: "desc" }];
        let tasks = await taskRequest.postGetTasks(
          {
            firstResult: self.similarTask.items.length + self.pageOffset,
            maxResults: self.similarTask.pageSize
          }, reqData);
        // 如果有被筛选到的项目，下次请求分页需要补偿，重新请求时，重置补偿数量
        tasks = tasks.filter(task => {
          if (task.id !== self.task.id) {
            return true;
          } else {
            self.pageOffset += 1;
            return false;
          }
        });
        tasks = await processRequest.getAllTaskItemInfo(tasks, self.tenantId);
        self.similarTask.items = self.similarTask.items.concat(tasks);
        $state.loaded();
        if (tasks.length + self.pageOffset < self.similarTask.pageSize) {
          // 加载完成
          $state.complete();
        }
      } catch (e) {
        $state.complete();
      }
    }
  }
};
</script>

<style scoped>

</style>
