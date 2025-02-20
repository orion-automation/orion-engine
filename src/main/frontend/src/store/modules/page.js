const state = {
  initLink: "", excludeName: []
};

const getters = {
  excludeName(state) {
    return state.excludeName;
  }
};
const mutations = {
  setInitLink(state, initLink) {
    state.initLink = initLink;
  }, setExcludeName(state, excludeName) {
    state.excludeName = excludeName;
  }
};

const actions = {
  setExcludeName(context, excludeName) {
    context.commit("setExcludeName", excludeName);
  }
};

export default {
  namespaced: true, state, mutations, actions, getters
};
