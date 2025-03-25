import apiClient from "./api.service";

export default {
  loginNhanVien(credentials) {
    return apiClient.post("/api/auth/login/nhanvien", credentials);
  },
  loginDocGia(credentials) {
    return apiClient.post("/api/auth/login/docgia", credentials);
  },
  registerDocGia(user) {
    return apiClient.post("/api/auth/register/docgia", user);
  },
};
