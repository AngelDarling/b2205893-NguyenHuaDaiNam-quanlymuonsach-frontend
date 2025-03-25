<template>
    <div class="login-container">
        <div class="card login-card shadow-lg">
            <div class="card-body">
                <div class="text-center mb-4">
                    <h2 class="login-title">Quản Lý Mượn Sách</h2>
                    <p class="text-muted">Đăng nhập để tiếp tục</p>
                </div>

                <!-- Tabs để chọn loại người dùng -->
                <ul class="nav nav-tabs mb-4" id="loginTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="nhanvien-tab" data-bs-toggle="tab"
                            data-bs-target="#nhanvien" type="button" role="tab" aria-controls="nhanvien"
                            aria-selected="true">Nhân Viên</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="docgia-tab" data-bs-toggle="tab" data-bs-target="#docgia"
                            type="button" role="tab" aria-controls="docgia" aria-selected="false">Độc Giả</button>
                    </li>
                </ul>

                <!-- Nội dung của các tab -->
                <div class="tab-content" id="loginTabContent">
                    <!-- Form đăng nhập cho Nhân Viên -->
                    <div class="tab-pane fade show active" id="nhanvien" role="tabpanel" aria-labelledby="nhanvien-tab">
                        <form @submit.prevent="dangNhap('nhanvien')">
                            <div class="mb-3">
                                <label for="msnv" class="form-label">Mã Nhân Viên (MSNV)</label>
                                <input id="msnv" v-model="nhanVienCredentials.MSNV" class="form-control"
                                    placeholder="Nhập mã nhân viên" required />
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
                                    {{ isLoading.nhanvien ? 'Đang đăng nhập...' : 'Đăng Nhập' }}
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Form đăng nhập cho Độc Giả -->
                    <div class="tab-pane fade" id="docgia" role="tabpanel" aria-labelledby="docgia-tab">
                        <form @submit.prevent="dangNhap('docgia')">
                            <div class="mb-3">
                                <label for="madocgia" class="form-label">Mã Độc Giả (MaDocGia)</label>
                                <input id="madocgia" v-model="docGiaCredentials.MaDocGia" class="form-control"
                                    placeholder="Nhập mã độc giả" required />
                            </div>
                            <div class="mb-3">
                                <label for="docgia-password" class="form-label">Mật Khẩu</label>
                                <input id="docgia-password" v-model="docGiaCredentials.Password" type="password"
                                    class="form-control" placeholder="Nhập mật khẩu" required />
                            </div>
                            <div v-if="errorMessage.docgia" class="alert alert-danger" role="alert">
                                {{ errorMessage.docgia }}
                            </div>
                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading.docgia">
                                    {{ isLoading.docgia ? 'Đang đăng nhập...' : 'Đăng Nhập' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="text-center mt-3">
                    <p class="text-muted">Chưa có tài khoản? <router-link to="/dang-ky">Đăng ký ngay</router-link></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from '../services/auth.service';

export default {
    data() {
        return {
            nhanVienCredentials: {
                MSNV: '',
                Password: '',
            },
            docGiaCredentials: {
                MaDocGia: '',
                Password: '',
            },
            errorMessage: {
                nhanvien: '',
                docgia: '',
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
                this.errorMessage[userType] = '';

                let credentials = userType === 'nhanvien' ? this.nhanVienCredentials : this.docGiaCredentials;
                credentials.userType = userType; // Thêm userType vào payload

                const response = await AuthService.login(credentials);

                this.$store.dispatch('login', {
                    user: response.data.user,
                    token: response.data.token,
                    userType: response.data.user.type,
                });

                // Điều hướng dựa trên loại người dùng
                if (userType === 'nhanvien') {
                    this.$router.push('/manage-sach');
                } else {
                    this.$router.push('/');
                }
            } catch (err) {
                this.errorMessage[userType] = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.';
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
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
    width: 100%;
    max-width: 450px;
    border: none;
    border-radius: 15px;
    background-color: #ffffff;
}

.login-title {
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

.nav-tabs .nav-link {
    border-radius: 8px 8px 0 0;
}

.nav-tabs .nav-link.active {
    background-color: #007bff;
    color: white;
}
</style>