<template>
  <v-app id="app" dark>
    <router-view />
  </v-app>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";

export default {
  name: "App",

  components: {},

  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
.formio-component-form {
  .input-group-text {
    height: 100%;
    border-radius: 0;
  }
}
* {
  letter-spacing: 0;
}
</style>
<style>
a {
  text-decoration: none;
}
.router-link-active {
  text-decoration: none;
}

.v-btn {
  text-transform: none;
}


ul.v-breadcrumbs {
  padding: 13px 13px;
  background-color: #ffffff;
  border-bottom: 1px solid #e6e4e6;
  border-top: 1px solid #e6e4e6;
}

div.breadcrumb-count {
  background-color: #ffffff;
  border-bottom: 1px solid #e6e4e6;
  border-top: 1px solid #e6e4e6;
  font-size: 14px;
  vertical-align: middle;
  padding: 13px 0;
}

.v-toolbar--dense .v-toolbar__content,
.v-toolbar--dense .v-toolbar__extension {
  padding-right: 0px;
}

.v-tabs-items .el-table .el-table__cell {
  padding: 6px 0;
}

ul.id-breadcrumbs.v-breadcrumbs {
  padding-left: 0;
}
.id-breadcrumbs.theme--light.v-breadcrumbs
  .v-breadcrumbs__item.v-breadcrumbs__item--disabled {
  color: #83829a;
}

.bjs-powered-by {
  display: none;
}

div.horizontal-collapsed {
  top: 0px;
  transform: translateX(0%);
  width: 50px;
  z-index: 199;
  display: flex;
  flex-direction: column;
  left: 0;
  border-right: 1px solid rgba(177, 171, 182);
}

div.vertical-collapsed {
  width: 40px;
}

.v-icon.v-icon--link.navigation-icon {
  cursor: pointer;
  color: #ff7754;
  top: 10px;
  position: absolute;
  z-index: 199;
}

.v-icon.v-icon--link.navigation-icon.mdi-chevron-right,
.v-icon.v-icon--link.navigation-icon.mdi-chevron-left {
  right: 10px;
}

div.v-slide-group__content .v-icon.v-icon--link.navigation-icon {
  left: 10px;
}

label.v-label {
  margin-bottom: 0;
}

/* div.v-menu__content.v-menu__content--fixed.menuable__content__active {
  background-color: #ffffff;
} */
</style>

<style>
.v-application a{
  font-weight: normal !important;
}
.custom-drawer-item {
  border-top: 1px solid rgba(177, 171, 182, 1);
  border-bottom: 1px solid rgba(177, 171, 182, 1);
  padding: 10px 15px;
  font-size: 14px;
  color: #83829A;
  align-items: center;
  height: 43px;
}

.custom-drawer-item-selected {
  background-color: #F3F4F9;
  font-weight: bold;
  color: #444262;
  height: 43px;
}

.theme--light.v-navigation-drawer:not(.v-navigation-drawer--floating) .v-navigation-drawer__border {
  background-color: rgb(187, 187, 187) !important;
}

.custom-drawer-item .v-btn {
  height: 44px !important;
}

.custom-drawer-item .v-divider--vertical {
  border-color: rgba(177, 171, 182, 1) !important;
  border-right-width: 1px !important;
  border-right-style: solid;
}

.el-table-column--selection .cell {
  padding-left: 10px !important;
  padding-right: 10px !important;
  display: flex !important;
  align-items: center;
  justify-items: center;
  justify-content: center;
}

.custom-drawer-item .v-chip {
  font-weight: bold;
}

.v-navigation-drawer:not(.v-navigation-drawer--close) {
  z-index: 10;
  box-shadow: none;
}

.custom-drawer-item-icon {
  margin-right: 10px;
}

a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

.v-btn {
  text-transform: none;
}

.v-application a {
  font-weight: bold;
}

ul.v-breadcrumbs {
  padding: 13px 13px;
  background-color: #ffffff;
  border-bottom: 1px solid #e6e4e6;
  border-top: 1px solid #e6e4e6;
}

div.breadcrumb-count {
  background-color: #ffffff;
  border-bottom: 1px solid #e6e4e6;
  border-top: 1px solid #e6e4e6;
  font-size: 14px;
  vertical-align: middle;
  padding: 13px 0;
}

.v-toolbar--dense .v-toolbar__content,
.v-toolbar--dense .v-toolbar__extension {
  padding-right: 0px;
}

.v-tabs-items .el-table .el-table__cell {
  padding: 6px 0;
}

ul.id-breadcrumbs.v-breadcrumbs {
  padding-left: 0;
}

.id-breadcrumbs.theme--light.v-breadcrumbs
.v-breadcrumbs__item.v-breadcrumbs__item--disabled {
  color: #83829a;
}

.bjs-powered-by {
  display: none;
}

div.horizontal-collapsed {
  top: 0px;
  transform: translateX(0%);
  width: 50px;
  z-index: 199;
  display: flex;
  flex-direction: column;
  left: 0;
  border-right: 1px solid rgba(177, 171, 182);
}

div.vertical-collapsed {
  width: 40px;
}

.v-icon.v-icon--link.navigation-icon {
  cursor: pointer;
  color: #ff7754;
  top: 10px;
  position: absolute;
  z-index: 199;
}

.v-icon.v-icon--link.navigation-icon.mdi-chevron-right,
.v-icon.v-icon--link.navigation-icon.mdi-chevron-left {
  right: 10px;
}

div.v-slide-group__content .v-icon.v-icon--link.navigation-icon {
  left: 10px;
}

label.v-label {
  margin-bottom: 0;
}

div.layout-content .v-btn--fab.v-btn--absolute.theme--light {
  position: fixed;
}

.infinite-more-container {
  font-size: 12px;
  color: #b1abb6;
  align-items: center;
  justify-content: center;
}

.infinite-more-container-pre {
  width: 15px;
  height: 1px;
  border: 1px dashed rgba(177, 171, 182, 1);
}

.infinite-more-container-content {
  padding: 10px;
}

.field-required:after {
  z-index: 0;
}

.vc-day {
  z-index: 0 !important;
}

.formio-component-dataSourceGroup {
  margin-bottom: 0;
}

span.badge {
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-weight: bold;
  font-size: 12px;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: 6px;
  background-color: #ff7754;
  border: 0;
  margin-right: 10px;
  color: #fff;
}

/* div.v-menu__content.v-menu__content--fixed.menuable__content__active {
  background-color: #ffffff;
} */
</style>
