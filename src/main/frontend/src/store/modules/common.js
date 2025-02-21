import {
  setDelegateId,
  getDelegateId
} from "@/utils/auth";

const state = {
  isLoading: false,
  authorizedDialog: false,
  navigations: [],
  currentNavigation: "",
  delegateId: null,
  appBarTitle: "",
  appBarIcons: [],
  currentAppBarIcon: "",
  editTaskId: "",
  editInstanceId: "",
  xDetailLeftDrawer: false,
  xDetailRightDrawer: false,
  xDetailName: "",
  createInstanceVars: [],
  bpmnElements: [],
  resourceNotDialog: false,
  resourceNotRedirectUrl: "",
  nocoConfigLoading: true,
};

const mutations = {
  SET_EDIT_TASK_ID(state, taskId) {
    state.editTaskId = taskId;
  },
  SET_EDIT_INSTANCE_ID(state, taskId) {
    state.editInstanceId = taskId;
  },
  SET_LOADING(state, loading) {
    state.isLoading = loading;
  },
  SET_AUTHORIZED_DIALOG(state, show) {
    state.authorizedDialog = show;
  },
  SET_NAVIGATIONS(state, value) {
    state.navigations = value;
  },
  SET_CURRENT_NAVIGATION(state, value) {
    state.currentNavigation = value;
  },
  SET_APP_BAR_TITLE(state, value) {
    state.appBarTitle = value;
  },
  SET_APP_BAR_ICONS(state, value) {
    state.appBarIcons = value;
  },
  SET_CURRENT_APP_BAR_ICON(state, value) {
    state.currentAppBarIcon = value;
  },
  SET_DELEGATE_ID(state, value) {
    state.delegateId = value;
  },
  SET_X_DETAIL_LEFT_DRAWER(state) {
    state.xDetailLeftDrawer = !state.xDetailLeftDrawer;
  },
  SET_X_DETAIL_RIGHT_DRAWER(state, value) {
    if (value === true || value === false) {
      state.xDetailRightDrawer = value;
    } else {
      state.xDetailRightDrawer = !state.xDetailRightDrawer;
    }
  },
  SET_X_DETAIL_NAME(state, value) {
    state.xDetailName = value;
  },
  SET_CREATE_INSTANCE_VARS(state, value) {
    state.createInstanceVars = value;
  },
  SET_RESOURCE_DIALOG(state, payload) {
    state.resourceNotDialog = payload.show;
    state.resourceNotRedirectUrl = payload.redirectUrl;
  },
  SET_NOCO_CONFIG_LOADING(state, show) {
    state.nocoConfigLoading = show;
  },
};

const actions = {
  setResourceDialog({ commit }, payload) {
    commit("SET_RESOURCE_DIALOG", payload);
  },
  setNocoConfigLoading({ commit }, loading){
    commit("SET_NOCO_CONFIG_LOADING", loading);
  },
  setCreateInstanceVars({ commit }, value) {
    commit("SET_CREATE_INSTANCE_VARS", value);
  },
  setAuthorizedDialog({ commit }, show) {
    commit("SET_AUTHORIZED_DIALOG", show);
  },
  setLoading({ commit }, loading) {
    commit("SET_LOADING", loading);
  },
  setPageLoading({ commit }, loading) {
    commit("SET_LOADING", loading ? "page" : false);
  },
  setNavigations({ commit }, value) {
    commit("SET_NAVIGATIONS", value);
  },
  setCurrentNavigation({ commit }, value) {
    commit("SET_CURRENT_NAVIGATION", value);
  },
  setAppBarIcons({ commit }, value) {
    commit("SET_APP_BAR_ICONS", value);
  },
  setAppBarTitle({ commit }, value) {
    commit("SET_APP_BAR_TITLE", value);
  },
  setCurrentAppBarIcon({ commit }, value) {
    commit("SET_CURRENT_APP_BAR_ICON", value);
  },
  setDelegateId({ commit }, value) {
    commit("SET_DELEGATE_ID", value);
    setDelegateId(value);
  },
  setEditTaskId({ commit }, value) {
    commit("SET_EDIT_TASK_ID", value);
  },
  setEditInstanceId({ commit }, value) {
    commit("SET_EDIT_INSTANCE_ID", value);
  },
  setXDetailLeftDrawer({ commit }) {
    commit("SET_X_DETAIL_LEFT_DRAWER");
  },
  setXDetailRightDrawer({ commit }, value) {
    commit("SET_X_DETAIL_RIGHT_DRAWER", value);
  },
  setXDetailName({ commit }, value) {
    commit("SET_X_DETAIL_NAME", value);
  }
};

const getters = {
  getCreateInstanceVars(state) {
    return state.createInstanceVars;
  },
  getLoading(state) {
    return state.isLoading;
  },
  getNavigations(state) {
    return state.navigations;
  },
  getCurrentNavigation(state) {
    return state.currentNavigation;
  },
  getAuthorizedDialog(state) {
    return state.authorizedDialog;
  },
  getXDetailName(state) {
    return state.xDetailName;
  },
  getDelegateId(state) {
    return state.delegateId || getDelegateId();
  },
  getIsLoading(state) {
    return state.isLoading;
  },
  getShowResourceDialog(state) {
    return state.resourceNotDialog;
  },
  getReDirectUrlResourceDialog(state) {
    return state.resourceNotRedirectUrl;
  },
  isNocoConfigLoading:state=>{
    return !!state.nocoConfigLoading;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
