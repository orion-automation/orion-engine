import userRequest from "@/api/user";
import {
    setTenant,
    setTenantName,
    getTenantName,
    getTenant,
    getExtraToken,
    setExtraToken,
    removeExtraToken,
    getToken,
    setToken,
    removeToken,
    getBasicToken,
    setBasicToken,
    removeBasicToken
} from "@/utils/auth";

const state = {
    token: getToken(),
    extraToken: getExtraToken(),
    basicToken: getBasicToken(),
    profile: {},
    preferenceJson: {
        mobile: {
            theme: "light", eoaiMode: "auto", eoaiAvatar: "land-plots-circle", eoaiName: "EO"
        }
    },
    authorization: [],
    groups: [],
    tenant: getTenant(),
    tenantName: getTenantName(),
};

const mutations = {
    SET_EXTRA_TOKEN: (state, token) => {
        state.extraToken = token;
    },
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_BASIC_TOKEN: (state, basicToken) => {
        state.basicToken = basicToken;
    },
    SET_PROFILE: (state, profile) => {
        state.profile = profile;
    },
    SET_GROUPS: (state, groups) => {
        state.groups = groups;
    },
    SET_AUTHORIZATION: (state, authorization) => {
        state.authorization = authorization;
    },
    SET_PREFERENCE_JSON: (state, preferenceJson) => {
        if (!preferenceJson.mobile) {
            preferenceJson.mobile = {
                theme: "light", eoaiMode: "auto", eoaiAvatar: "land-plots-circle", eoaiName: "EO"
            };
        }
        state.preferenceJson = preferenceJson;
    },
    SET_TENANT: (state, tenant) => {
        setTenant(tenant);
        state.tenant = tenant;
    },
    SET_TENANTNAME: (state, tenantName) => {
        setTenantName(tenantName);
        state.tenantName = tenantName;
    }
};

const actions = {
    // user login
    login({commit}, userInfo) {
        const {username, password} = userInfo;
        let basicToken = "Basic " + window.btoa(username + ":" + password);
        commit("SET_BASIC_TOKEN", basicToken);
        setBasicToken(basicToken);
        return new Promise((resolve, reject) => {
            if (process.env.VUE_APP_AUTH_TYPE === "JWT") {
                userRequest.loginJWT({username: username.trim(), password: password}).then(responseJWT => {
                    commit("SET_EXTRA_TOKEN", responseJWT);
                    setExtraToken(responseJWT);
                    userRequest.login({username: username.trim(), password: password}).then(response => {
                        if (!response.authenticated) {
                            reject("fail");
                        }
                        commit("SET_TOKEN", response.authenticatedUser);
                        setToken(response.authenticatedUser);
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
                }).catch(error => {
                    reject(error);
                });
            } else if (process.env.VUE_APP_AUTH_TYPE === "Basic Auth") {
                userRequest.login({username: username.trim(), password: password}).then(response => {
                    if (!response.authenticated) {
                        reject("fail");
                    }
                    commit("SET_TOKEN", response.authenticatedUser);
                    setToken(response.authenticatedUser);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            }
        });
    },
    // get user info
    getProfile({commit, state}) {
        return new Promise((resolve, reject) => {
            userRequest.getProfile(state.token).then(response => {
                return new Promise((resolveProfile, reject) => {
                    if (!response) {
                        reject("Verification failed, please Login again.");
                    }
                    commit("SET_PROFILE", response);
                    resolveProfile(response);
                });
            }).then(profile => {
                resolve(profile);
            }).catch(error => {
                reject(error);
            });
        });
    },
    getGroups({commit, state}) {
        return new Promise((resolve, reject) => {
            userRequest.getGroups(state.token).then(response => {
                if (!response) {
                    reject("Verification failed, please Login again.");
                }
                commit("SET_GROUPS", response.groups);
                resolve(response.groups);
            }).catch(error => {
                reject(error);
            });
        });
    },
    getAuthorization({commit, state}) {
        return new Promise((resolve, reject) => {
            userRequest.getAuthorization({
                groupIdIn: state.groups.map(group => group.id).join(","),
                resourceType: 0
            }).then(response => {
                if (!response) {
                    reject("Verification failed, please Login again.");
                }
                commit("SET_AUTHORIZATION", response);
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    },

    setTenantAction({commit}, payload) {
        commit("SET_TENANT", payload.id);
        commit("SET_TENANTNAME", payload.name);
    },

    // user logout
    logout({commit, state, dispatch}) {
        return new Promise((resolve, reject) => {
            userRequest.logout(state.token).then(() => {
                commit("SET_TOKEN", "");
                commit("SET_EXTRA_TOKEN", "");
                removeToken();
                removeBasicToken();
                removeExtraToken();
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    },

    // remove token
    resetToken({commit}) {
        return new Promise(resolve => {
            commit("SET_TOKEN", "");
            commit("SET_EXTRA_TOKEN", "");
            removeToken();
            removeBasicToken();
            removeExtraToken();
            resolve();
        });
    }
};

// getters
const getters = {
    isProcessDefaultRuntime: state => {
        if (Object.keys(state.preferenceJson).length > 0) {
            return state.preferenceJson.processDefault === "runtime";
        }
        return true;
    },
    getBiUrl: state => {
        if (Object.keys(state.preferenceJson).length > 0) {
            return state.preferenceJson.biUrl;
        }
        return "";
    },
    hasTenant: state => {
        return !!state.tenant && !!getTenant();
    },
    getTenant: state => {
        return {
            id: state.tenant, name: state.tenantName
        };
    },
    getUserName: state => {
        return `${state.profile.firstName} ${state.profile.lastName}`;
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
