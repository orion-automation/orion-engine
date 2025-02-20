const state = {
    // id,name,projectId,type
    lastResourceList: []
};
const LastResourceList_KEY = "lastResourceList";
const LastResourceList_MAX_LENGTH = 30;

const mutations = {
    Add_LAST_RESOURCE_LIST(state, resource) {
        let oldList = JSON.parse(localStorage.getItem(LastResourceList_KEY) || "[]");
        let index = oldList.findIndex(item => item.id === resource.id);
        if (index === -1) {
            // 新的resource
            oldList.push(Object.assign(resource, {stamp: new Date().getTime()}));
        } else {
            // 移动到第一个
            oldList[index].stamp = new Date().getTime();
        }
        // 排序
        oldList.sort(function (a, b) {
            return b.stamp - a.stamp;
        });
        // 限制当前项目存储长度
        let currentProjectList = [];
        oldList.forEach(item => {
            if (item.projectId == resource.projectId) {
                currentProjectList.push(item);
            }
        });
        if (currentProjectList.length > LastResourceList_MAX_LENGTH) {
            oldList = oldList.filter(item => {
                return item.id !== currentProjectList[currentProjectList.length - 1].id;
            });
        }
        state.lastResourceList = oldList;
        localStorage.setItem(LastResourceList_KEY, JSON.stringify(oldList));
    },
};

const actions = {
    addLastResourceList({commit}, resource) {
        commit("Add_LAST_RESOURCE_LIST", resource);
    },
};

const getters = {
    getLastResourceList(state) {
        return function (projectId) {
            let list = JSON.parse(localStorage.getItem(LastResourceList_KEY) || "[]");
            state.lastResourceList = list;
            return list.filter(item => item.projectId == projectId);
        };
    },
};

export default {
    namespaced: true, state, getters, mutations, actions,
};
