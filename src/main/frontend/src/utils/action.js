
export default {

  defaultActions: [
    { title: "Start Before", id: "startBeforeActivity", show: true },
    { title: "Start After", id: "startAfterActivity", show: true },
    { title: "Cancel", id: "cancel", condition: "instances", show: true },
    {
      title: "Start Before(Multi Instance)",
      id: "startBeforeActivityMultiInstance",
      show: true,
    },
    {
      title: "Start After(Multi Instance)",
      id: "startAfterActivityMultiInstance",
      show: true,
    },
    {
      title: "Cancel(Multi Instance)",
      id: "cancelMultiInstance",
      condition: "instances",
      show: true,
    },
  ],

  variableActions: [
    { title: "变量历史", id: "onVariableHistory", show: true },
  ],

  getActions(instruction, nodeProperties) {
    var isMultiInstance =
      instruction.activityId.indexOf("#multiInstanceBody") > 0;
    var property = nodeProperties[instruction.activityId.replace("#multiInstanceBody", "")];
    var actions = this.defaultActions.filter((action) => {
      var matchCondition = !action.condition || property && property[action.condition];
      var matchMultiInstance =
        isMultiInstance == (action.id.indexOf("MultiInstance") > 0);
      return matchCondition && matchMultiInstance;
    });

    return actions;
  },

};
