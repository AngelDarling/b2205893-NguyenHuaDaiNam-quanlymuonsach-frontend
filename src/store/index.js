import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
    token: null,
    userType: null, // Thêm trường userType để lưu loại người dùng ('nhanvien' hoặc 'docgia')
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
    setUserType(state, userType) {
      state.userType = userType;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.userType = null;
    },
  },
  actions: {
    login({ commit }, { user, token, userType }) {
      commit("setUser", user);
      commit("setToken", token);
      commit("setUserType", userType);
    },
    logout({ commit }) {
      commit("logout");
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
    currentUser(state) {
      return state.user;
    },
    userType(state) {
      return state.userType;
    },
  },
});
