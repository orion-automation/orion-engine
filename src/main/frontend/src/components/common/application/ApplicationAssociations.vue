<template>
  <v-bottom-sheet v-model="associations.display" inset>
    <v-sheet>
      <div class="drawer-title">{{ title }}</div>
      <div class="drawer-title-line"></div>
      <v-row no-gutters style="margin: 20px 0 0 0; padding-bottom: 20px">
        <template v-if="currentApp">
          <v-col
            cols="3"
            @click="onItemClick(currentApp)"
            style="margin-top: 10px; margin-bottom: 30px"
          >
            <div class="drawer-icon">
              <i
                class="fa-regular"
                :class="(currentApp && currentApp.icon)"
                style="color: #312651; font-size: 25px; margin-bottom: 6px"
              ></i>
              {{ $t('currentApp') }}
            </div>
          </v-col>
          <v-col
            cols="3"
            style="margin-top: 10px; margin-bottom: 30px"
          >
          </v-col>
          <v-col
            cols="3"
            style="margin-top: 10px; margin-bottom: 30px"
          >
          </v-col>
          <v-col
            cols="3"
            style="margin-top: 10px; margin-bottom: 30px"
          >
          </v-col>

        </template>
        <v-col
          cols="3"
          style="margin: 10px 0"
          v-for="association in associations.items"
          @click="onItemClick(association)"
          :key="association.id"
        >
          <div class="drawer-icon">
            <i
              class="fa-regular"
              :class="association.icon"
              style="color: #312651; font-size: 25px; margin-bottom: 6px"
            ></i>
            {{ association.name }}
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import processRequest from "@/api/process";

export default {
  name: "ApplicationAssociations",
  props: {
    processDefKey: {
      type: String,
      required: true
    },
    processDeploymentId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default() {
        this.$t("linkApp");
      },
    },
    currentApp: {
      type: Object
    }
  },
  methods: {
    show(show) {
      this.associations.display = show;
    },
    onItemClick(association) {
      this.$emit("onItemClick", association);
    }
  },
  data() {
    return {
      associations: {
        display: false,
        items: []
      },
      userId: this.$store.state.user.profile.id
    };
  },
  watch: {
    "associations.display": {
      async handler(val) {
        if (val) {
          let associations = await processRequest.getProcessList(
            {
              deploymentId: this.processDeploymentId,
              startableBy: this.userId
            },
            1,
            100
          );
          associations = associations.filter(
            (association) => association.key !== this.processDefKey
          );
          let processDefKeyIn = [];
          associations.forEach(association => {
            if (!processDefKeyIn.includes(association.key)) {
              processDefKeyIn.push(association.key);
            }
          });
          // 获取流程对应icon
          let iconResults = await processRequest.getProcessIconByKeys(this.$store.getters["user/getTenant"].id, processDefKeyIn);
          associations.forEach(resource => {
            let iconResult = iconResults.find(iconResult => iconResult.appKey === resource.key);
            let icon = { color: "#444262" };
            if (iconResult && iconResult.configJson) {
              icon.icon = `${iconResult.configJson.iconType} fa-fw ${iconResult.configJson.icon}`;
            }
            resource.icon = icon.icon;
            resource.color = icon.color;
          });

          this.associations.items = associations;
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.drawer-icon {
  color: #83829a;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.drawer-title {
  text-align: center;
  padding: 10px 0 7px 0;
  color: #ff7754;
  font-size: 14px;
}

.drawer-title-line {
  width: 34px;
  height: 3px;
  background-color: #e6e4e6;
  margin: auto;
}

.dashed {
  border-bottom: 1px #bbbbbb dashed;
  margin: 14px 0;
}
</style>
