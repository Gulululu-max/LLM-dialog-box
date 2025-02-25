import { createStore } from "vuex";

//从localStorage中加载历史会话
const loadSessions = () => {
    const sessions = localStorage.getItem('session');
    return sessions ? JSON.stringify(sessions) : [];
};

export default createStore({
    state:{
        sessions: loadSessions(),
        currentSessionId: null, //当前会话id
    },
    getters:{
        sessions: (state) => state.sessions,
        currentSession: (state) => {
            return state.sessions.find(session => session.id === state.currentSessionId);
        },
    },
    mutations:{
        // 添加新会话
      ADD_SESSION(state) {
        const newSession = {
          id: Date.now(), // 使用时间戳作为唯一 ID
          messages: [], // 初始消息列表为空
        };
        state.sessions.push(newSession);
        state.currentSessionId = newSession.id; // 设置为当前会话
        localStorage.setItem('sessions', JSON.stringify(state.sessions));
      },
      // 删除会话
      DELETE_SESSION(state, sessionId) {
        state.sessions = state.sessions.filter(session => session.id !== sessionId);
        localStorage.setItem('sessions', JSON.stringify(state.sessions));
      },
      // 设置当前会话
      SET_CURRENT_SESSION(state, sessionId) {
        state.currentSessionId = sessionId;
      },
      // 添加消息到当前会话
      ADD_MESSAGE(state, message) {
        const session = state.sessions.find(session => session.id === state.currentSessionId);
        if (session) {
          session.messages.push(message);
          localStorage.setItem('sessions', JSON.stringify(state.sessions));
        }
      },
    },
    actions: {
    addSession({ commit }) {
      commit('ADD_SESSION');
    },
    deleteSession({ commit }, sessionId) {
      commit('DELETE_SESSION', sessionId);
    },
    setCurrentSession({ commit }, sessionId) {
      commit('SET_CURRENT_SESSION', sessionId);
    },
    addMessage({ commit }, message) {
      commit('ADD_MESSAGE', message);
    },
  },
})