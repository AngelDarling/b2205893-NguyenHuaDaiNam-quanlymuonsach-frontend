import apiClient from "./api.service";

export default {
  getAll() {
    return apiClient.get("/api/theodoimuonsach");
  },
  create(muonsach) {
    return apiClient.post("/api/theodoimuonsach", muonsach);
  },
  update(id, muonsach) {
    return apiClient.put(`/api/theodoimuonsach/${id}`, muonsach);
  },
  delete(id) {
    return apiClient.delete(`/api/theodoimuonsach/${id}`);
  },
};
