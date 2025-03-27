<!-- views/ManageDocGia.vue -->
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
            <h2 class="mb-4">Quản Lý Độc Giả</h2>
            <div class="mb-3 d-flex justify-content-between">
                <div>
                    <button class="btn btn-primary" @click="showAddModal">Thêm độc giả</button>
                </div>
                <div>
                    <input type="text" v-model="searchQuery" class="form-control"
                        placeholder="Tìm kiếm độc giả theo tên..." @input="fetchDocGia" />
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
            <div v-else-if="docGiaList.length === 0" class="text-center">
                <p>Không có độc giả nào để hiển thị.</p>
            </div>
            <div v-else>
                <table class="table table-bordered table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Mã Độc Giả</th>
                            <th>Họ Lót</th>
                            <th>Tên</th>
                            <th>Ngày Sinh</th>
                            <th>Phái</th>
                            <th>Địa Chỉ</th>
                            <th>Điện Thoại</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="docGia in docGiaList" :key="docGia._id">
                            <td>{{ docGia.MaDocGia }}</td>
                            <td>{{ docGia.HoLot }}</td>
                            <td>{{ docGia.Ten }}</td>
                            <td>{{ formatDate(docGia.NgaySinh) }}</td>
                            <td>{{ docGia.Phai }}</td>
                            <td>{{ docGia.DiaChi }}</td>
                            <td>{{ docGia.DienThoai }}</td>
                            <td>
                                <button class="btn btn-warning btn-sm me-2" @click="editDocGia(docGia)">Sửa</button>
                                <button class="btn btn-danger btn-sm" @click="deleteDocGia(docGia._id)">Xóa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Phân trang -->
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        <p>Hiển thị {{ docGiaList.length }} / {{ total }} độc giả</p>
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

            <!-- Modal thêm/sửa độc giả -->
            <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ isEditMode ? "Sửa độc giả" : "Thêm độc giả" }}</h5>
                            <button type="button" class="btn-close" @click="closeModal"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveDocGia">
                                <div class="mb-3">
                                    <label for="maDocGia" class="form-label">Mã Độc Giả</label>
                                    <input id="maDocGia" v-model="currentDocGia.MaDocGia" class="form-control"
                                        required />
                                </div>
                                <div class="mb-3">
                                    <label for="hoLot" class="form-label">Họ Lót</label>
                                    <input id="hoLot" v-model="currentDocGia.HoLot" class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="ten" class="form-label">Tên</label>
                                    <input id="ten" v-model="currentDocGia.Ten" class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="ngaySinh" class="form-label">Ngày Sinh</label>
                                    <input id="ngaySinh" v-model="currentDocGia.NgaySinh" type="date"
                                        class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="phai" class="form-label">Phái</label>
                                    <select id="phai" v-model="currentDocGia.Phai" class="form-control" required>
                                        <option value="" disabled>Chọn giới tính</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="diaChi" class="form-label">Địa Chỉ</label>
                                    <input id="diaChi" v-model="currentDocGia.DiaChi" class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="dienThoai" class="form-label">Điện Thoại</label>
                                    <input id="dienThoai" v-model="currentDocGia.DienThoai" class="form-control"
                                        required />
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
            docGiaList: [],
            loading: false,
            errorMessage: "",
            showModal: false,
            isEditMode: false,
            isLoading: false,
            currentDocGia: {
                MaDocGia: "",
                HoLot: "",
                Ten: "",
                NgaySinh: "",
                Phai: "",
                DiaChi: "",
                DienThoai: "",
                Password: "",
            },
            searchQuery: "", // Từ khóa tìm kiếm
            currentPage: 1, // Trang hiện tại
            limit: 10, // Số độc giả mỗi trang
            total: 0, // Tổng số độc giả
            totalPages: 1, // Tổng số trang
        };
    },
    mounted() {
        const token = localStorage.getItem("token");
        if (!token) {
            this.$router.push("/dang-nhap");
            return;
        }
        this.fetchDocGia();
    },
    methods: {
        async fetchDocGia() {
            try {
                this.loading = true;
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const response = await axios.get("http://localhost:3000/docGia", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        search: this.searchQuery,
                        page: this.currentPage,
                        limit: this.limit,
                    },
                });
                this.docGiaList = response.data.docGias;
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
            this.currentDocGia = {
                MaDocGia: "",
                HoLot: "",
                Ten: "",
                NgaySinh: "",
                Phai: "",
                DiaChi: "",
                DienThoai: "",
                Password: "",
            };
            this.showModal = true;
        },
        editDocGia(docGia) {
            this.isEditMode = true;
            this.currentDocGia = { ...docGia, Password: "" };
            this.showModal = true;
        },
        async saveDocGia() {
            try {
                this.isLoading = true;

                // Validate dữ liệu
                if (!this.currentDocGia.MaDocGia) {
                    throw new Error("Mã độc giả không được để trống.");
                }
                if (!this.currentDocGia.HoLot) {
                    throw new Error("Họ lót không được để trống.");
                }
                if (!this.currentDocGia.Ten) {
                    throw new Error("Tên không được để trống.");
                }
                if (!this.currentDocGia.NgaySinh) {
                    throw new Error("Ngày sinh không được để trống.");
                }
                if (!this.currentDocGia.Phai) {
                    throw new Error("Vui lòng chọn giới tính.");
                }
                if (!this.currentDocGia.DiaChi) {
                    throw new Error("Địa chỉ không được để trống.");
                }
                if (!this.currentDocGia.DienThoai) {
                    throw new Error("Điện thoại không được để trống.");
                }
                if (!/^\d{10}$/.test(this.currentDocGia.DienThoai)) {
                    throw new Error("Điện thoại phải là số và có đúng 10 chữ số.");
                }

                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                if (!this.isEditMode) {
                    this.currentDocGia.Password = this.currentDocGia.MaDocGia;
                }

                if (this.isEditMode) {
                    const { Password, ...updateData } = this.currentDocGia;
                    await axios.put(`http://localhost:3000/docGia/${this.currentDocGia._id}`, updateData, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Độc giả đã được cập nhật thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } else {
                    await axios.post("http://localhost:3000/docGia", this.currentDocGia, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Độc giả đã được thêm thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
                this.closeModal();
                this.fetchDocGia();
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
        async deleteDocGia(id) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const result = await Swal.fire({
                    title: "Bạn có chắc chắn muốn xóa độc giả này?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Xóa",
                    cancelButtonText: "Hủy",
                });

                if (result.isConfirmed) {
                    await axios.delete(`http://localhost:3000/docGia/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Thành công!",
                        text: "Độc giả đã được xóa thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    this.fetchDocGia();
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
                this.fetchDocGia();
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.fetchDocGia();
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString("vi-VN");
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