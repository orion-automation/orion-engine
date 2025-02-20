// 定义一个常量，以后直接在数组中增加页面的path就ok了
import {mapActions, mapGetters} from "vuex";

const PageArray = [
    {
        currentPage: "search-list",
        nextPage: ["application-instance",
            "task-detail",
            "application-detail"]
    },
];

export const myDestroyed = {
    computed: {
        ...mapGetters("page", ["excludeName"])
    },
    methods: {
        ...mapActions("page", ["setExcludeName"])
    },
    data() {
        return {
            currentPath: "",
            currentName: "",
        };
    },
    created() {
        this.myExcludeName = this.excludeName;
        for (let i = 0; i < this.myExcludeName.length; i += 1) {
            if (this.myExcludeName[i] === this.$route.name) {
                this.myExcludeName.splice(i, 1);
                break;
            }
        }
        this.setExcludeName([this.myExcludeName]);
        this.currentPath = this.$route.path;
        this.currentName = this.$route.name;
    },
    deactivated() {
        /*
        * myDestroyed
        *   从 currentPage 页面计入 nextPage 页面时 keep-alive
        *   其他情况均销毁 currentPage 页面
        *
        * 使用注意事项：
        *   router中
        *     meta:{
        *       keep-alive: true
        *     }
        *
        *    组建 name 必须写对
        *
        *  使用方法：
        *     在PageArray中增加currentPage<String>和nextPage<Array>
        * */
        let nextName = this.$route.name;
        let currentName = this.currentName;// 当前页面name
        for (let i = 0; i < PageArray.length; i += 1) {
            let item = PageArray[i];
            if (currentName === item.currentPage) {
                let isDestroy = !item.nextPage.some(nextItem => {
                    // 匹配上: 不销毁当前页面
                    return nextName === nextItem;
                });
                if (isDestroy) { // 销毁当前页
                    this.setExcludeName([currentName]);
                    break;
                }
            }
        }
    }
};

