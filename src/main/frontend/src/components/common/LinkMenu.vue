<template>
  <div class="d-flex flex-column" style="padding: 36px;background-color: white">
    <template v-for="(menu,index) in menus">
      <div class="link-menu-title" :key="`link-menu-${index}-title`">{{ menu.title }}</div>
      <div class="link-menu-project-item d-flex flex-row"
           :key="`link-menu-${index}-content`"
           :style="index===menus.length-1?{marginBottom:'0'}:{}">
        <div class="d-flex flex-column"
             style="cursor: pointer;min-width: 150px"
             @click="onItemClick(menu,child)"
             v-for="(child,childIndex) in menu.children"
             :key="`link-menu-${index}-${childIndex}-container`">
          <div class="link-menu-item-title-container d-flex flex-row">
            <v-icon class="link-menu-item-title-icon" color="#FF7754" size="20">{{ child.icon }}</v-icon>
            <div class="link-menu-item-title">{{ child.title }}</div>
          </div>
          <div class="d-flex flex-row" style="align-items: center">
            <v-icon class="link-menu-item-title-icon-placeholder" color="#FF7754" size="20">{{ child.icon }}</v-icon>
            <div class="link-menu-item-desc">{{ child.desc }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: "LinkMenu",
  data() {
    return {
      menus: [
        {
          title: this.$t("linkMenu.design"),
          children: [
            {
              icon: "mdi-drawing", title: this.$t("linkMenu.designCenter"), desc: this.$t("linkMenu.designCenterDesc"),
              action: {
                title: "designCenter",
              }
            }
          ]
        },
        {
          title: this.$t("linkMenu.automation"),
          children: [
            {
              icon: "mdi-thermostat-auto",
              title: this.$t("linkMenu.automationCenter"),
              desc: this.$t("linkMenu.automationCenterDesc"),
              action: {
                title: "automationCenter",
              }
            }]
        },
        {
          title: this.$t("linkMenu.app"),
          children: [
            {
              icon: "mdi-apps-box", title: "x-Apps", desc: this.$t("linkMenu.xApp"), action: {
                title: "taskCenter",
                value: "/x/index",
              }
            },
            {
              icon: "mdi-calendar-multiselect",
              title: this.$t("linkMenu.taskCenter"),
              desc: this.$t("linkMenu.taskCenterDesc"),
              action: {
                title: "taskCenter",
              }
            }]
        },
        {
          title: this.$t("linkMenu.system"),
          children: [
            {
              icon: "mdi-home", title: this.$t("linkMenu.home"), desc: this.$t("linkMenu.homeDesc"), action: {
                title: "homeCenter",
              }
            },
            {
              icon: "mdi-tune-variant",
              title: this.$t("linkMenu.adminCenter"),
              desc: this.$t("linkMenu.adminCenterDesc"),
              action: {
                title: "adminCenter",
              }
            }, {
              icon: "mdi-book-open",
              title: this.$t("linkMenu.doc"),
              desc: this.$t("linkMenu.docDesc"),
              action: {
                title: "windowOpen",
                value: "https://www.eorion.com/documents.html"
              }
            }]
        }
      ]
    };
  },
  methods: {
    onItemClick(project, item) {
      let self = this;
      switch (item.action.title) {
        case "windowOpen":
          // 打开新页面并跳转固定url
          window.open(item.action.value);
          break;
        case "designCenter":
          // 设计中心
          if (!Cookies.get("hr-tenant")) {
            self.$notify.error(self.$t("linkMenu.noTenant"));
            return;
          }
          this.$router.replace("/design/");
          break;
        case "adminCenter":
          // 管理中心
          this.$router.replace("/admin/user");
          break;
        case "taskCenter":
          // 任务中心
          if (!Cookies.get("hr-tenant")) {
            self.$notify.error(self.$t("linkMenu.noTenant"));
            return;
          }
          if (item.action.value) {
            this.$router.replace(`/task${item.action.value}`);
          } else {
            this.$router.replace("/task/");
          }
          break;
        case "automationCenter":
          // 自动化中心
          this.$router.replace("/automation/");
          break;
        case "homeCenter":
          // 首页
          this.$router.replace("/");
          break;
      }
    }
  },
  watch: {
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.menus = [
          {
            title: self.$t("linkMenu.design"),
            children: [
              {
                icon: "mdi-drawing",
                title: self.$t("linkMenu.designCenter"),
                desc: self.$t("linkMenu.designCenterDesc"),
                action: {
                  title: "designCenter",
                }
              }]
          },
          {
            title: self.$t("linkMenu.automation"),
            children: [
              {
                icon: "mdi-thermostat-auto",
                title: self.$t("linkMenu.automationCenter"),
                desc: self.$t("linkMenu.automationCenterDesc"),
                action: {
                  title: "automationCenter",
                }
              }]
          },
          {
            title: self.$t("linkMenu.app"),
            children: [
              {
                icon: "mdi-apps-box", title: "x-Apps", desc: self.$t("linkMenu.xApp"), action: {
                  title: "taskCenter",
                  value: "/x/index",
                }
              },
              {
                icon: "mdi-calendar-multiselect",
                title: self.$t("linkMenu.taskCenter"),
                desc: self.$t("linkMenu.taskCenterDesc"),
                action: {
                  title: "taskCenter",
                }
              }]
          },
          {
            title: self.$t("linkMenu.system"),
            children: [
              {
                icon: "mdi-home", title: self.$t("linkMenu.home"), desc: self.$t("linkMenu.homeDesc"), action: {
                  title: "homeCenter",
                }
              },
              {
                icon: "mdi-tune-variant",
                title: self.$t("linkMenu.adminCenter"),
                desc: self.$t("linkMenu.adminCenterDesc"),
                action: {
                  title: "adminCenter",
                }
              }, {
                icon: "mdi-book-open",
                title: self.$t("linkMenu.doc"),
                desc: self.$t("linkMenu.docDesc"),
                action: {
                  title: "windowOpen",
                  value: "https://www.eorion.com/documents.html"
                }
              }]
          }
        ];
      },
    },
  }
};
</script>

<style scoped>
.link-menu-title {
  color: #83829A;
  font-size: 12px;
  margin-bottom: 16px;
}

.link-menu-project-item {
  gap: 25px;
  margin-bottom: 26px;
}

.link-menu-item-title-container {
  align-items: center;
}

.link-menu-item-title-icon {
  margin-right: 10px;
}

.link-menu-item-title {
  color: #444262;
  font-size: 14px;
  font-weight: bold;
}

.link-menu-item-title-icon-placeholder {
  visibility: hidden;
  margin-right: 10px;
}

.link-menu-item-desc {
  color: #83829A;
  font-size: 12px;
}
</style>
