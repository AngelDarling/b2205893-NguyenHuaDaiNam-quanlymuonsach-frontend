<!-- views/Home.vue -->
<template>
    <div class="home-container">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Danh Sách Sách</h2>
        </div>
        <div class="mb-3 d-flex align-items-center justify-content-center gap-3">
            <div style="width: 300px;">
                <input type="text" v-model="searchQuery" class="form-control" placeholder="Tìm kiếm sách theo tên..."
                    @input="fetchSach" />
            </div>
            <div style="width: 200px;">
                <select v-model="selectedNXB" class="form-control" @change="fetchSach">
                    <option value="">Tất cả nhà xuất bản</option>
                    <option v-for="nxb in nhaXuatBanList" :key="nxb.MaNXB" :value="nxb.MaNXB">
                        {{ nxb.TenNXB }}
                    </option>
                </select>
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
        <div v-else-if="sachList.length === 0" class="text-center">
            <p>Không có sách nào để hiển thị.</p>
        </div>
        <div v-else>
            <table class="table table-bordered table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Mã Sách</th>
                        <th>Tên Sách</th>
                        <th>Đơn Giá</th>
                        <th>Số Quyển</th>
                        <th>Năm Xuất Bản</th>
                        <th>Nhà Xuất Bản</th>
                        <th>Tác Giả</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="sach in sachList" :key="sach._id">
                        <td>{{ sach.MaSach }}</td>
                        <td>{{ sach.TenSach }}</td>
                        <td>{{ formatCurrency(sach.DonGia) }}</td>
                        <td>{{ sach.SoQuyen }}</td>
                        <td>{{ sach.NamXuatBan }}</td>
                        <td>{{ sach.nhaXuatBan ? sach.nhaXuatBan.TenNXB : "Không xác định" }}</td>
                        <td>{{ sach.TacGia }}</td>
                        <td>
                            <button class="btn btn-success btn-sm" @click="showMuonSachModal(sach)"
                                :disabled="sach.SoQuyen === 0">
                                {{ sach.SoQuyen === 0 ? "Hết sách" : "Mượn sách" }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Phân trang -->
            <div class="d-flex justify-content-between align-items-center mt-3">
                <div>
                    <p>Hiển thị {{ sachList.length }} / {{ total }} sách</p>
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

        <!-- Modal mượn sách -->
        <div class="modal fade" id="muonSachModal" tabindex="-1" aria-labelledby="muonSachModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="muonSachModalLabel">
                            Mượn Sách: {{ selectedSach?.TenSach }}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="muonSach">
                            <div class="mb-3">
                                <label for="soLuongMuon" class="form-label">
                                    Số lượng mượn (Còn lại: {{ selectedSach?.SoQuyen }})
                                </label>
                                <input type="number" id="soLuongMuon" v-model.number="soLuongMuon" class="form-control"
                                    min="1" :max="selectedSach?.SoQuyen" required @input="calculateTotalPrice" />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Tổng giá tiền</label>
                                <p class="form-control-static">{{ formatCurrency(totalPrice) }}</p>
                            </div>
                            <div class="mb-3">
                                <label for="ngayMuon" class="form-label">Ngày Mượn</label>
                                <input type="date" id="ngayMuon" v-model="ngayMuon" class="form-control" required />
                            </div>
                            <div class="mb-3">
                                <label for="ngayTra" class="form-label">Ngày Trả</label>
                                <input type="date" id="ngayTra" v-model="ngayTra" class="form-control" required />
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Xác nhận mượn</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

export default {
    data() {
        return {
            sachList: [],
            nhaXuatBanList: [],
            loading: false,
            errorMessage: "",
            searchQuery: "",
            selectedNXB: "",
            currentPage: 1,
            limit: 5,
            total: 0,
            totalPages: 1,
            selectedSach: null,
            ngayMuon: "",
            ngayTra: "",
            soLuongMuon: 1, // Số lượng mượn mặc định là 1
            totalPrice: 0, // Tổng giá tiền
            muonSachModal: null,
        };
    },
    mounted() {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token || role !== "docGia") {
            this.$router.push("/dang-nhap");
            return;
        }
        this.fetchNhaXuatBan();
        this.fetchSach();
        this.initializeModal();
    },
    watch: {
        searchQuery() {
            this.currentPage = 1;
            this.fetchSach();
        },
        selectedNXB() {
            this.currentPage = 1;
            this.fetchSach();
        },
    },
    methods: {
        async fetchSach() {
            try {
                this.loading = true;
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }
                const response = await axios.get("http://localhost:3000/sach", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        search: this.searchQuery,
                        maNXB: this.selectedNXB,
                        page: this.currentPage,
                        limit: this.limit,
                    },
                });
                this.sachList = response.data.sachs || [];
                this.total = response.data.total || 0;
                this.currentPage = response.data.page || 1;
                this.limit = response.data.limit || this.limit;
                this.totalPages = response.data.totalPages || 1;
            } catch (err) {
                this.handleError(err);
            } finally {
                this.loading = false;
            }
        },
        async fetchNhaXuatBan() {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:3000/nhaXuatBan", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                this.nhaXuatBanList = response.data.nhaXuatBans || [];
            } catch (err) {
                this.handleError(err);
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.fetchSach();
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.fetchSach();
            }
        },
        formatCurrency(value) {
            return new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(value);
        },
        logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            this.$router.push("/dang-nhap");
            Swal.fire({
                icon: "success",
                title: "Đăng xuất thành công!",
                timer: 1500,
                showConfirmButton: false,
            });
        },
        handleError(err) {
            const message = err.response?.data?.message || err.message || "Không thể tải dữ liệu. Vui lòng thử lại.";
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
        initializeModal() {
            const modalElement = document.getElementById("muonSachModal");
            this.muonSachModal = new Modal(modalElement);
            modalElement.addEventListener("hidden.bs.modal", () => {
                this.selectedSach = null;
                this.ngayMuon = "";
                this.ngayTra = "";
                this.soLuongMuon = 1;
                this.totalPrice = 0;
            });
        },
        showMuonSachModal(sach) {
            this.selectedSach = sach;
            this.ngayMuon = new Date().toISOString().split("T")[0];
            this.ngayTra = "";
            this.soLuongMuon = 1;
            this.calculateTotalPrice();
            this.muonSachModal.show();
        },
        calculateTotalPrice() {
            if (this.selectedSach && this.soLuongMuon) {
                this.totalPrice = this.selectedSach.DonGia * this.soLuongMuon;
            } else {
                this.totalPrice = 0;
            }
        },
        async muonSach() {
            try {
                const token = localStorage.getItem("token");
                const role = localStorage.getItem("role");
                const maDocGia = localStorage.getItem("maDocGia");
                if (role !== "docGia") {
                    throw new Error("Chỉ độc giả mới có thể mượn sách.");
                }
                if (!maDocGia) {
                    throw new Error("Không tìm thấy mã độc giả. Vui lòng đăng nhập lại.");
                }
                if (new Date(this.ngayTra) <= new Date(this.ngayMuon)) {
                    throw new Error("Ngày trả phải sau ngày mượn.");
                }
                if (this.soLuongMuon < 1 || this.soLuongMuon > this.selectedSach.SoQuyen) {
                    throw new Error("Số lượng mượn không hợp lệ.");
                }

                // Gửi yêu cầu mượn sách
                const response = await axios.post(
                    "http://localhost:3000/theoDoiMuonSach",
                    {
                        MaDocGia: maDocGia,
                        MaSach: this.selectedSach.MaSach,
                        NgayMuon: new Date(this.ngayMuon),
                        NgayTra: new Date(this.ngayTra),
                        SoLuong: this.soLuongMuon,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                // // Cập nhật số lượng sách trong CSDL
                // await axios.put(
                //     `http://localhost:3000/sach/${this.selectedSach._id}`,
                //     {
                //         ...this.selectedSach,
                //         SoQuyen: this.selectedSach.SoQuyen - this.soLuongMuon,
                //     },
                //     {
                //         headers: { Authorization: `Bearer ${token}` },
                //     }
                // );

                Swal.fire({
                    icon: "success",
                    title: "Mượn sách thành công!",
                    text: `Bạn đã mượn ${this.soLuongMuon} quyển sách ${this.selectedSach.TenSach}. Tổng giá: ${this.formatCurrency(this.totalPrice)}.`,
                    timer: 2000,
                    showConfirmButton: false,
                });

                this.muonSachModal.hide();
                this.fetchSach();
            } catch (err) {
                const message = err.response?.data?.message || err.message || "Không thể mượn sách. Vui lòng thử lại.";
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: message,
                    confirmButtonText: "OK",
                });
            }
        },
    },
};
</script>

<style scoped>
.home-container {
    padding: 20px;
    background-color: #f8f9fa;
    min-height: 100vh;
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

.spinner-border {
    width: 2rem;
    height: 2rem;
}

.btn-secondary {
    background-color: #6c757d;
    border: none;
}

.btn-secondary:hover {
    background-color: #5a6268;
}

.btn-danger {
    background-color: #dc3545;
    border: none;
}

.btn-danger:hover {
    background-color: #c82333;
}

.btn-success {
    background-color: #28a745;
    border: none;
}

.btn-success:hover {
    background-color: #218838;
}

.gap-3 {
    gap: 1rem;
}
</style>