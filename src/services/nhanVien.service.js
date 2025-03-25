import apiClient from "./api.service";

export default {
  getAll() {
    return apiClient.get("/api/nhanvien");
  },
  create(nhanVien) {
    return apiClient.post("/api/nhanvien", nhanVien);
  },
  update(id, nhanVien) {
    return apiClient.put(`/api/nhanvien/${id}`, nhanVien);
  },
  delete(id) {
    return apiClient.delete(`/api/nhanvien/${id}`);
  },
};
