<!-- views/ManageNhanVien.vue -->
<template>
    <div class="manage-container d-flex">
        <!-- Sidebar -->
        <div class="sidebar bg-dark text-white p-3">
            <h4 class="text-center mb-4">Quản Lý</h4>
            <ul class="nav flex-column">
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/dashboard">Dashboard</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/manage-sach">Quản lý sách</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/manage-doc-gia">Quản lý độc giả</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/manage-nhan-vien">Quản lý nhân viên</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/manage-nha-xuat-ban">Quản lý nhà xuất
                        bản</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/manage-theo-doi-muon-sach">Theo dõi mượn
                        sách</router-link>
                </li>
            </ul>
        </div>

        <!-- Nội dung chính -->
        <div class="content p-4 flex-grow-1">
            <h2 class="mb-4">Quản Lý Nhân Viên</h2>
            <div class="mb-3 d-flex justify-content-between">
                <div>
                    <button class="btn btn-primary" @click="showAddModal">Thêm nhân viên</button>
                </div>
                <div>
                    <input type="text" v-model="searchQuery" class="form-control"
                        placeholder="Tìm kiếm nhân viên theo họ tên..." @input="fetchNhanVien" />
                </div>
            </div>
            <div v-if="loading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
            </div>
            <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>
            <div v-else-if="nhanVienList.length === 0" class="text-center">
                <p>Không có nhân viên nào để hiển thị.</p>
            </div>
            <div v-else>
                <table class="table table-bordered table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Mã Nhân Viên</th>
                            <th>Họ Tên</th>
                            <th>Chức Vụ</th>
                            <th>Địa Chỉ</th>
                            <th>Số Điện Thoại</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="nhanVien in nhanVienList" :key="nhanVien._id">
                            <td>{{ nhanVien.MSNV }}</td>
                            <td>{{ nhanVien.HoTenNV }}</td>
                            <td>{{ nhanVien.Chucvu }}</td>
                            <td>{{ nhanVien.Diachi }}</td>
                            <td>{{ nhanVien.SoDienThoai }}</td>
                            <td>
                                <button class="btn btn-warning btn-sm me-2" @click="editNhanVien(nhanVien)">Sửa</button>
                                <button class="btn btn-danger btn-sm" @click="deleteNhanVien(nhanVien._id)">Xóa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Phân trang -->
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        <p>Hiển thị {{ nhanVienList.length }} / {{ total }} nhân viên</p>
                    </div>
                    <div>
                        <button class="btn btn-secondary me-2" @click="prevPage" :disabled="currentPage === 1">
                            Trang trước
                        </button>
                        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
                        <button class="btn btn-secondary ms-2" @click="nextPage" :disabled="currentPage === totalPages">
                            Trang sau
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal thêm/sửa nhân viên -->
            <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ isEditMode ? "Sửa nhân viên" : "Thêm nhân viên" }}</h5>
                            <button type="button" class="btn-close" @click="closeModal"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveNhanVien">
                                <div class="mb-3">
                                    <label for="msnv" class="form-label">Mã Nhân Viên</label>
                                    <input id="msnv" v-model="currentNhanVien.MSNV" class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="hoTenNV" class="form-label">Họ Tên</label>
                                    <input id="hoTenNV" v-model="currentNhanVien.HoTenNV" class="form-control"
                                        required />
                                </div>
                                <div class="mb-3">
                                    <label for="chucVu" class="form-label">Chức Vụ</label>
                                    <input id="chucVu" v-model="currentNhanVien.Chucvu" class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="diaChi" class="form-label">Địa Chỉ</label>
                                    <input id="diaChi" v-model="currentNhanVien.Diachi" class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="soDienThoai" class="form-label">Số Điện Thoại</label>
                                    <input id="soDienThoai" v-model="currentNhanVien.SoDienThoai" class="form-control"
                                        required />
                                </div>
                                <div v-if="!isEditMode" class="mb-3">
                                    <label for="password" class="form-label">Mật Khẩu</label>
                                    <input id="password" v-model="currentNhanVien.Password" type="password"
                                        class="form-control" required />
                                </div>
                                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                                    {{ isLoading ? "Đang lưu..." : "Lưu" }}
                                </button>
                                <button type="button" class="btn btn-secondary ms-2" @click="closeModal">Hủy</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showModal" class="modal-backdrop fade show"></div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
    data() {
        return {
            nhanVienList: [],
            loading: false,
            errorMessage: "",
            showModal: false,
            isEditMode: false,
            isLoading: false,
            currentNhanVien: {
                MSNV: "",
                HoTenNV: "",
                Chucvu: "",
                Diachi: "",
                SoDienThoai: "",
                Password: "",
            },
            searchQuery: "", // Từ khóa tìm kiếm
            currentPage: 1, // Trang hiện tại
            limit: 10, // Số nhân viên mỗi trang
            total: 0, // Tổng số nhân viên
            totalPages: 1, // Tổng số trang
        };
    },
    mounted() {
        const token = localStorage.getItem("token");
        if (!token) {
            this.$router.push("/dang-nhap");
            return;
        }
        this.fetchNhanVien();
    },
    methods: {
        async fetchNhanVien() {
            try {
                this.loading = true;
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const response = await axios.get("http://localhost:3000/nhanVien", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        search: this.searchQuery,
                        page: this.currentPage,
                        limit: this.limit,
                    },
                });
                this.nhanVienList = response.data.nhanViens;
                this.total = response.data.total;
                this.currentPage = response.data.page;
                this.limit = response.data.limit;
                this.totalPages = response.data.totalPages;
            } catch (err) {
                this.handleError(err);
            } finally {
                this.loading = false;
            }
        },
        showAddModal() {
            this.isEditMode = false;
            this.currentNhanVien = {
                MSNV: "",
                HoTenNV: "",
                Chucvu: "",
                Diachi: "",
                SoDienThoai: "",
                Password: "",
            };
            this.showModal = true;
        },
        editNhanVien(nhanVien) {
            this.isEditMode = true;
            this.currentNhanVien = { ...nhanVien, Password: "" };
            this.showModal = true;
        },
        async saveNhanVien() {
            try {
                this.isLoading = true;

                // Validate dữ liệu
                if (!this.currentNhanVien.MSNV) {
                    throw new Error("Mã nhân viên không được để trống.");
                }
                if (!this.currentNhanVien.HoTenNV) {
                    throw new Error("Họ tên không được để trống.");
                }
                if (!this.currentNhanVien.Chucvu) {
                    throw new Error("Chức vụ không được để trống.");
                }
                if (!this.currentNhanVien.Diachi) {
                    throw new Error("Địa chỉ không được để trống.");
                }
                if (!this.currentNhanVien.SoDienThoai) {
                    throw new Error("Số điện thoại không được để trống.");
                }
                if (!/^\d{10}$/.test(this.currentNhanVien.SoDienThoai)) {
                    throw new Error("Số điện thoại phải là số và có đúng 10 chữ số.");
                }
                if (!this.isEditMode && !this.currentNhanVien.Password) {
                    throw new Error("Mật khẩu không được để trống khi thêm mới.");
                }

                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                if (this.isEditMode) {
                    const { Password, ...updateData } = this.currentNhanVien;
                    await axios.put(`http://localhost:3000/nhanVien/${this.currentNhanVien._id}`, updateData, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Nhân viên đã được cập nhật thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } else {
                    await axios.post("http://localhost:3000/nhanVien", this.currentNhanVien, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Nhân viên đã được thêm thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
                this.closeModal();
                this.fetchNhanVien();
            } catch (err) {
                const message = err.response?.data?.message || err.message || "Đã xảy ra lỗi.";
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: message,
                    confirmButtonText: "OK",
                });
            } finally {
                this.isLoading = false;
            }
        },
        async deleteNhanVien(id) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const result = await Swal.fire({
                    title: "Bạn có chắc chắn muốn xóa nhân viên này?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Xóa",
                    cancelButtonText: "Hủy",
                });

                if (result.isConfirmed) {
                    await axios.delete(`http://localhost:3000/nhanVien/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Nhân viên đã được xóa thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    this.fetchNhanVien();
                }
            } catch (err) {
                const message = err.response?.data?.message || err.message || "Đã xảy ra lỗi.";
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: message,
                    confirmButtonText: "OK",
                });
            }
        },
        closeModal() {
            this.showModal = false;
        },
        handleError(err) {
            const message = err.response?.data?.message || err.message || "Đã xảy ra lỗi.";
            if (message.includes("Token không hợp lệ") || message.includes("Không có token")) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                this.$router.push("/dang-nhap");
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
                    confirmButtonText: "OK",
                });
            } else {
                this.errorMessage = message;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.fetchNhanVien();
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.fetchNhanVien();
            }
        },
    },
};
</script>

<style scoped>
.manage-container {
    min-height: 100vh;
}

.sidebar {
    width: 250px;
    min-height: 100vh;
}

.sidebar .nav-link {
    padding: 10px;
    border-radius: 5px;
}

.sidebar .nav-link:hover {
    background-color: #495057;
}

.content {
    background-color: #f8f9fa;
}

.table {
    border-radius: 8px;
    overflow: hidden;
}

.table th,
.table td {
    vertical-align: middle;
}

.table-dark {
    background-color: #343a40;
    color: white;
}

.btn-primary {
    background-color: #007bff;
    border: none;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.btn-warning {
    background-color: #ffc107;
    border: none;
}

.btn-warning:hover {
    background-color: #e0a800;
}

.btn-danger {
    background-color: #dc3545;
    border: none;
}

.btn-danger:hover {
    background-color: #c82333;
}

.btn-secondary {
    background-color: #6c757d;
    border: none;
}

.btn-secondary:hover {
    background-color: #5a6268;
}

.modal {
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    border-radius: 8px;
}

.spinner-border {
    width: 2rem;
    height: 2rem;
}
</style>