<!-- views/DangNhap.vue -->
<template>
  <div class="login-container">
    <div class="card login-card shadow-lg">
      <div class="card-body">
        <div class="text-center mb-4">
          <h2 class="login-title">QUẢN LÝ MƯỢN SÁCH</h2>
          <p class="text-muted">Đăng nhập để tiếp tục</p>
        </div>

        <!-- Tabs để chọn loại người dùng -->
        <ul class="nav nav-tabs mb-4" id="loginTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link" :class="{ active: activeTab === 'nhanvien' }" @click="activeTab = 'nhanvien'"
              type="button">
              Nhân Viên
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" :class="{ active: activeTab === 'docgia' }" @click="activeTab = 'docgia'"
              type="button">
              Độc Giả
            </button>
          </li>
        </ul>

        <!-- Nội dung của các tab -->
        <div class="tab-content" id="loginTabContent">
          <!-- Form đăng nhập cho Nhân Viên -->
          <div v-if="activeTab === 'nhanvien'">
            <form @submit.prevent="dangNhap('nhanvien')">
              <div class="mb-3">
                <label for="msnv" class="form-label">Mã Nhân Viên (MSNV)</label>
                <input id="msnv" v-model="nhanVienCredentials.MSNV" class="form-control" placeholder="Nhập mã nhân viên"
                  required />
              </div>
              <div class="mb-3">
                <label for="nhanvien-password" class="form-label">Mật Khẩu</label>
                <input id="nhanvien-password" v-model="nhanVienCredentials.Password" type="password"
                  class="form-control" placeholder="Nhập mật khẩu" required />
              </div>
              <div v-if="errorMessage.nhanvien" class="alert alert-danger" role="alert">
                {{ errorMessage.nhanvien }}
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading.nhanvien">
                  {{ isLoading.nhanvien ? "Đang đăng nhập..." : "Đăng Nhập" }}
                </button>
              </div>
            </form>
          </div>

          <!-- Form đăng nhập cho Độc Giả -->
          <div v-if="activeTab === 'docgia'">
            <form @submit.prevent="dangNhap('docgia')">
              <div class="mb-3">
                <label for="madocgia" class="form-label">Mã Độc Giả (MaDocGia)</label>
                <input id="madocgia" v-model="docGiaCredentials.MaDocGia" class="form-control"
                  placeholder="Nhập mã độc giả" required />
              </div>
              <div class="mb-3">
                <label for="docgia-password" class="form-label">Mật Khẩu</label>
                <input id="docgia-password" v-model="docGiaCredentials.Password" type="password" class="form-control"
                  placeholder="Nhập mật khẩu" required />
              </div>
              <div v-if="errorMessage.docgia" class="alert alert-danger" role="alert">
                {{ errorMessage.docgia }}
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading.docgia">
                  {{ isLoading.docgia ? "Đang đăng nhập..." : "Đăng Nhập" }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="text-center mt-3">
          <p class="text-muted">
            Chưa có tài khoản? <router-link to="/dang-ky">Đăng ký ngay</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      activeTab: "nhanvien", // Tab mặc định là Nhân Viên
      nhanVienCredentials: {
        MSNV: "",
        Password: "",
      },
      docGiaCredentials: {
        MaDocGia: "",
        Password: "",
      },
      errorMessage: {
        nhanvien: "",
        docgia: "",
      },
      isLoading: {
        nhanvien: false,
        docgia: false,
      },
    };
  },
  methods: {
    async dangNhap(userType) {
      try {
        this.isLoading[userType] = true;
        this.errorMessage[userType] = "";

        const credentials =
          userType === "nhanvien" ? this.nhanVienCredentials : this.docGiaCredentials;
        const endpoint =
          userType === "nhanvien"
            ? "http://localhost:3000/nhanVien/login"
            : "http://localhost:3000/docGia/login";

        const response = await axios.post(endpoint, credentials);

        // Lưu token và role vào localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        if (response.data.role === "docGia") {
          localStorage.setItem("maDocGia", response.data.maDocGia);
        }

        Swal.fire({
          icon: "success",
          title: "Đăng nhập thành công!",
          text: "Chào mừng bạn đến với hệ thống quản lý thư viện.",
          timer: 1500,
          showConfirmButton: false,
        });

        // Điều hướng dựa trên loại người dùng
        if (userType === "nhanvien") {
          this.$router.push("/dashboard"); // Chuyển hướng nhân viên đến dashboard
        } else {
          this.$router.push("/home"); // Chuyển hướng độc giả đến Home
        }
      } catch (err) {
        this.errorMessage[userType] =
          err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra thông tin.";
      } finally {
        this.isLoading[userType] = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  /* Căn giữa theo chiều ngang */
  align-items: center;
  /* Căn giữa theo chiều dọc */
  min-height: 100vh;
  /* Đảm bảo container chiếm toàn bộ chiều cao màn hình */
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  /* Thêm padding để tránh sát mép trên các màn hình nhỏ */
}

.login-card {
  width: 100%;
  max-width: 450px;
  /* Giới hạn chiều rộng tối đa của form */
  border: none;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  text-transform: uppercase;
}

.text-muted {
  font-size: 0.9rem;
}

.nav-tabs {
  border-bottom: none;
}

.nav-tabs .nav-link {
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  color: #333;
  background-color: #e9ecef;
  margin-right: 5px;
}

.nav-tabs .nav-link.active {
  background-color: #007bff;
  color: white;
}

.form-control {
  border-radius: 8px;
  padding: 10px;
  background-color: #f0f4f8;
  border: 1px solid #d1d9e6;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: none;
}

.alert-danger {
  background-color: #ffe6e6;
  color: #d32f2f;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-weight: 500;
  text-transform: uppercase;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-block {
  width: 100%;
}

.text-center a {
  color: #007bff;
  text-decoration: none;
}

.text-center a:hover {
  text-decoration: underline;
}
</style>