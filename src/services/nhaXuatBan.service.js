import apiClient from "./api.service";

export default {
  getAll() {
    return apiClient.get("/api/nhaXuatban");
  },
  create(nhaXuatban) {
    return apiClient.post("/api/nhaXuatban", nhaXuatban);
  },
  update(id, nhaXuatban) {
    return apiClient.put(`/api/nhaXuatban/${id}`, nhaXuatban);
  },
  delete(id) {
    return apiClient.delete(`/api/nhaXuatban/${id}`);
  },
};
