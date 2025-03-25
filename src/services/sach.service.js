import apiClient from "./api.service";

export default {
  getAll() {
    return apiClient.get("/api/sach");
  },
  create(sach) {
    return apiClient.post("/api/sach", sach);
  },
  update(id, sach) {
    return apiClient.put(`/api/sach/${id}`, sach);
  },
  delete(id) {
    return apiClient.delete(`/api/sach/${id}`);
  },
};
