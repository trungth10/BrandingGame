import "es6-promise/auto";

export const notify = {
  namespaced: true,
  state: {
    doingTasks: [],
    doneTasks: [],
    errorTasks: [],
    connection: {},
    connectionId: "",
  },
  getters: {},
  mutations: {
    addDoingTasks(state, context) {
      state.doingTasks.push(context);
    },
    addDoneTasks(state, context) {
      let task = state.doingTasks.filter((task) => task.id == context.id)[0];
      state.doingTasks.splice(state.doingTasks.indexOf(task), 1);
      state.doneTasks.push(context);
    },
    addErrorTasks(state, context) {
      state.errorTasks.push(context);
    },
    setConnection(state, context) {
      state.connection = context;
    },
    popDoneTasks(state, context) {
      let task = state.doneTasks.filter((task) => task.id == context.id)[0];
      state.doneTasks.splice(state.doingTasks.indexOf(task), 1);
    },
    setConnectionId(state, context) {
      state.connectionId = context;
    },
  },
};
