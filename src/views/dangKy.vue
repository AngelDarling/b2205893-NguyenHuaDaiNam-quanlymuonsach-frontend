<!-- views/dangKy.vue -->
<template>
    <div class="register-container">
        <div class="card register-card shadow-lg">
            <div class="card-body">
                <div class="text-center mb-4">
                    <h2 class="register-title">Quản Lý Mượn Sách</h2>
                    <p class="text-muted">Đăng ký tài khoản độc giả</p>
                </div>

                <!-- Form đăng ký cho Độc Giả -->
                <form @submit.prevent="dangKy">
                    <div class="mb-3">
                        <label for="madocgia" class="form-label">Mã Độc Giả (MaDocGia)</label>
                        <input id="madocgia" v-model="docGiaData.MaDocGia" class="form-control"
                            placeholder="Nhập mã độc giả" required />
                    </div>
                    <div class="mb-3">
                        <label for="holot" class="form-label">Họ Lót</label>
                        <input id="holot" v-model="docGiaData.HoLot" class="form-control" placeholder="Nhập họ lót"
                            required />
                    </div>
                    <div class="mb-3">
                        <label for="ten" class="form-label">Tên</label>
                        <input id="ten" v-model="docGiaData.Ten" class="form-control" placeholder="Nhập tên" required />
                    </div>
                    <div class="mb-3">
                        <label for="ngaysinh" class="form-label">Ngày Sinh</label>
                        <input id="ngaysinh" v-model="docGiaData.NgaySinh" type="date" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label for="phai" class="form-label">Giới Tính</label>
                        <select id="phai" v-model="docGiaData.Phai" class="form-control" required>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="diachi" class="form-label">Địa Chỉ</label>
                        <input id="diachi" v-model="docGiaData.DiaChi" class="form-control" placeholder="Nhập địa chỉ"
                            required />
                    </div>
                    <div class="mb-3">
                        <label for="dienthoai" class="form-label">Điện Thoại</label>
                        <input id="dienthoai" v-model="docGiaData.DienThoai" type="tel" class="form-control"
                            placeholder="Nhập số điện thoại" required />
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Mật Khẩu</label>
                        <input id="password" v-model="docGiaData.Password" type="password" class="form-control"
                            placeholder="Nhập mật khẩu" required />
                    </div>
                    <div v-if="errorMessage" class="alert alert-danger" role="alert">
                        {{ errorMessage }}
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
                            {{ isLoading ? "Đang đăng ký..." : "Đăng Ký" }}
                        </button>
                    </div>
                </form>

                <div class="text-center mt-3">
                    <p class="text-muted">
                        Đã có tài khoản? <router-link to="/dang-nhap">Đăng nhập ngay</router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2"; // Thêm sweetalert2

export default {
    data() {
        return {
            docGiaData: {
                MaDocGia: "",
                HoLot: "",
                Ten: "",
                NgaySinh: "",
                Phai: "Nam",
                DiaChi: "",
                DienThoai: "",
                Password: "",
            },
            errorMessage: "",
            isLoading: false,
        };
    },
    methods: {
        async dangKy() {
            try {
                this.isLoading = true;
                this.errorMessage = "";

                await axios.post("http://localhost:3000/docGia", this.docGiaData); // Không cần token
                Swal.fire({
                    icon: "success",
                    title: "Thành công!",
                    text: "Đăng ký thành công! Vui lòng đăng nhập.",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    this.$router.push("/dang-nhap");
                });
            } catch (err) {
                const message = err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
                if (message.includes("MaDocGia đã tồn tại")) {
                    Swal.fire({
                        icon: "error",
                        title: "Lỗi!",
                        text: "Đã tồn tại mã độc giả, yêu cầu đổi mã khác.",
                        confirmButtonText: "OK",
                    });
                } else {
                    this.errorMessage = message;
                }
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>

<style scoped>
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.register-card {
    width: 100%;
    max-width: 450px;
    border: none;
    border-radius: 15px;
    background-color: #ffffff;
}

.register-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
}

.form-control {
    border-radius: 8px;
    padding: 10px;
    transition: border-color 0.3s ease;
}

.form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.btn-primary {
    background-color: #007bff;
    border: none;
    border-radius: 8px;
    padding: 10px;
    font-weight: 500;
    transition: background-color 0.3s ease;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.btn-block {
    width: 100%;
}
</style>