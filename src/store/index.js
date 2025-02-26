import { createStore } from "vuex";

//从localStorage中加载历史会话
const loadSessions = () => {
  const sessions = localStorage.getItem("sessions");
  return sessions ? JSON.parse(sessions) : [];
};
const saveSessionsToLocalStorage = (sessions) => {
  localStorage.setItem("sessions", JSON.stringify(sessions));
};

export default createStore({
  state: {
    sessions: loadSessions(),
    currentSessionId: null, //当前会话id
  },
  getters: {
    sessions: (state) => state.sessions,
    currentSession: (state) => {
      return state.sessions.find(
        (session) => session.id === state.currentSessionId
      );
    },
  },
  mutations: {
    // 添加新会话
    ADD_SESSION(state) {
      const newSession = {
        id: Date.now(),
        messages: [],
      };
      state.sessions.push(newSession);
      state.currentSessionId = newSession.id; // 设置为当前会话
      saveSessionsToLocalStorage(state.sessions);
    },
    //流式响应不断更新最后一条消息
    UPDATE_LAST_MESSAGE(state, message) {
      const session = state.sessions.find(
        (session) => session.id === state.currentSessionId
      );
      if (session) {
        session.messages.splice(session.messages.length - 1, 1, message);
        saveSessionsToLocalStorage(state.sessions);
      }
    },
    // 删除会话
    DELETE_SESSION(state, sessionId) {
      state.sessions = state.sessions.filter(
        (session) => session.id !== sessionId
      );
      if (state.currentSessionId === sessionId) {
        //如果删除的是当前对话框
        state.currentSessionId = null; // 重置当前会话
      }
      saveSessionsToLocalStorage(state.sessions);
    },
    // 设置当前会话
    SET_CURRENT_SESSION(state, sessionId) {
      state.currentSessionId = sessionId;
    },
    // 添加消息到当前会话
    ADD_MESSAGE(state, message) {
      const session = state.sessions.find(
        (session) => session.id === state.currentSessionId
      );
      if (session) {
        session.messages.push(message);
        saveSessionsToLocalStorage(state.sessions);
      }
    },
  },
  actions: {
    addSession({ commit }) {
      commit("ADD_SESSION");
    },
    updateLastMessage({ commit }, message) {
      commit("UPDATE_LAST_MESSAGE", message);
    },
    deleteSession({ commit }, sessionId) {
      commit("DELETE_SESSION", sessionId);
    },
    setCurrentSession({ commit }, sessionId) {
      commit("SET_CURRENT_SESSION", sessionId);
    },
    addMessage({ commit }, message) {
      commit("ADD_MESSAGE", message);
    },
  },
});
