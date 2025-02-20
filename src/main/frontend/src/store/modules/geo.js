const state = {
  resultLocation: {
    type: "NA",
    ip: "NA",
    latitude: "NA",
    longitude: "NA",
    formattedAddress: "NA"
  }
};

const mutations = {
  SET_LOCATION: (state, location) => {
    state.resultLocation = location;
  }
};

const actions = {
  setLocation({ commit }, location) {
    commit("SET_LOCATION", location);
  }
};

const getters = {
  getLocation(state) {
    return Object.assign(state.resultLocation, {
      showLocation: state.resultLocation.type === "ip" ? `${state.resultLocation.ip}` : `${parseFloat(state.resultLocation.longitude).toFixed(3)},${parseFloat(state.resultLocation.latitude).toFixed(3)}`,
      showType: state.resultLocation.type === "ip" ? "IP定位" : "微信定位",
    });
  }
};

export default {
  namespaced: true, state, mutations, actions, getters
};

