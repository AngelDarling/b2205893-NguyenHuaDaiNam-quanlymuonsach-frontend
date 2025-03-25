import apiClient from "./api.service";

export default {
  getAll() {
    return apiClient.get("/api/docgia");
  },
  create(docGia) {
    return apiClient.post("/api/docgia", docGia);
  },
  update(id, docGia) {
    return apiClient.put(`/api/docgia/${id}`, docGia);
  },
  delete(id) {
    return apiClient.delete(`/api/docgia/${id}`);
  },
};
