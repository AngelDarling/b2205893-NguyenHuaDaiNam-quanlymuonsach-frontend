<!-- views/Home.vue -->
<template>
    <div class="home-container">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Danh Sách Sách</h2>
            <button class="btn btn-info" @click="showLichSuMuonSachModal">Lịch sử mượn sách</button>
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
        <div v-else-if="filteredSachList.length === 0" class="text-center">
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
                    <tr v-for="sach in filteredSachList" :key="sach._id">
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
                    <p>Hiển thị {{ filteredSachList.length }} / {{ total }} sách</p>
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

        <!-- Modal lịch sử mượn sách -->
        <div class="modal fade" id="lichSuMuonSachModal" tabindex="-1" aria-labelledby="lichSuMuonSachModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="lichSuMuonSachModalLabel">Lịch Sử Mượn Sách</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="loadingLichSu" class="text-center">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Đang tải...</span>
                            </div>
                        </div>
                        <div v-else-if="errorMessageLichSu" class="alert alert-danger" role="alert">
                            {{ errorMessageLichSu }}
                        </div>
                        <div v-else-if="lichSuMuonSachList.length === 0" class="text-center">
                            <p>Bạn chưa mượn sách nào.</p>
                        </div>
                        <div v-else>
                            <table class="table table-bordered table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Mã Độc Giả</th>
                                        <th>Tên Sách</th>
                                        <th>Số quyển mượn</th>
                                        <th>Tổng Tiền</th>
                                        <th>Ngày Mượn</th>
                                        <th>Ngày Trả</th>
                                        <th>Tình trạng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="muonSach in lichSuMuonSachList" :key="muonSach._id">
                                        <td>{{ muonSach.MaDocGia }}</td>
                                        <td>{{ getTenSach(muonSach.MaSach) }}</td>
                                        <td>{{ muonSach.SoLuong }}</td>
                                        <td>{{ formatCurrency(getTongTien(muonSach)) }}</td>
                                        <td>{{ formatDate(muonSach.NgayMuon) }}</td>
                                        <td>{{ formatDate(muonSach.NgayTra) }}</td>
                                        <td>{{ getTinhTrang(muonSach) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
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
            lichSuMuonSachList: [],
            loading: false,
            loadingLichSu: false,
            errorMessage: "",
            errorMessageLichSu: "",
            searchQuery: "",
            selectedNXB: "",
            currentPage: 1,
            limit: 8,
            total: 0,
            totalPages: 1,
            selectedSach: null,
            ngayMuon: "",
            ngayTra: "",
            soLuongMuon: 1,
            totalPrice: 0,
            muonSachModal: null,
            lichSuMuonSachModal: null,
        };
    },
    computed: {
        filteredSachList() {
            return this.sachList.filter(sach => sach.TrangThai !== "DaXoa");
        },
    },
    mounted() {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) {
            this.$router.push("/dang-nhap");
            Swal.fire({
                icon: "error",
                title: "Lỗi!",
                text: "Không tìm thấy token. Vui lòng đăng nhập.",
                confirmButtonText: "OK",
            });
            return;
        }
        if (role !== "docGia") {
            this.$router.push("/dang-nhap");
            Swal.fire({
                icon: "error",
                title: "Lỗi!",
                text: "Trang này chỉ dành cho độc giả. Vui lòng đăng nhập bằng tài khoản độc giả.",
                confirmButtonText: "OK",
            });
            return;
        }
        this.fetchNhaXuatBan();
        this.fetchSach();
        this.initializeModals();
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
        async fetchLichSuMuonSach() {
            try {
                this.loadingLichSu = true;
                const token = localStorage.getItem("token");
                const maDocGia = localStorage.getItem("maDocGia");
                if (!token || !maDocGia) {
                    throw new Error("Không tìm thấy token hoặc mã độc giả. Vui lòng đăng nhập lại.");
                }
                const response = await axios.get("http://localhost:3000/theoDoiMuonSach", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        search: maDocGia,
                        limit: 1000,
                    },
                });
                this.lichSuMuonSachList = response.data.theoDoiMuonSachs || [];
            } catch (err) {
                this.errorMessageLichSu = err.response?.data?.message || err.message || "Không thể tải lịch sử mượn sách.";
            } finally {
                this.loadingLichSu = false;
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
        formatDate(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toLocaleDateString("vi-VN");
        },
        getTinhTrang(muonSach) {
            return muonSach.DaTra ? "Đã trả" : "Chưa trả";
        },
        getTenSach(maSach) {
            const sach = this.sachList.find(s => s.MaSach === maSach);
            return sach ? sach.TenSach : "Không tìm thấy sách";
        },
        getTongTien(muonSach) {
            const sach = this.sachList.find(s => s.MaSach === muonSach.MaSach);
            if (sach && muonSach.SoLuong) {
                return sach.DonGia * muonSach.SoLuong;
            }
            return 0;
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
            } else if (message.includes("Chỉ nhân viên mới có quyền thực hiện hành động này")) {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: "Bạn không có quyền thực hiện hành động này. Vui lòng đăng nhập bằng tài khoản nhân viên.",
                    confirmButtonText: "OK",
                });
            } else {
                this.errorMessage = message;
            }
        },
        initializeModals() {
            const muonSachModalElement = document.getElementById("muonSachModal");
            this.muonSachModal = new Modal(muonSachModalElement);
            muonSachModalElement.addEventListener("hidden.bs.modal", () => {
                this.selectedSach = null;
                this.ngayMuon = "";
                this.ngayTra = "";
                this.soLuongMuon = 1;
                this.totalPrice = 0;
            });

            const lichSuModalElement = document.getElementById("lichSuMuonSachModal");
            this.lichSuMuonSachModal = new Modal(lichSuModalElement);
            lichSuModalElement.addEventListener("hidden.bs.modal", () => {
                this.lichSuMuonSachList = [];
                this.errorMessageLichSu = "";
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
        showLichSuMuonSachModal() {
            this.fetchLichSuMuonSach();
            this.lichSuMuonSachModal.show();
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

.btn-info {
    background-color: #17a2b8;
    border: none;
    color: white;
}

.btn-info:hover {
    background-color: #138496;
}

.gap-3 {
    gap: 1rem;
}
</style>