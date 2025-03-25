<template>
    <div class="login-container">
        <div class="card login-card shadow-lg">
            <div class="card-body">
                <div class="text-center mb-4">
                    <h2 class="login-title">Quản Lý Mượn Sách</h2>
                    <p class="text-muted">Đăng nhập để tiếp tục</p>
                </div>
                <form @submit.prevent="dangNhap">
                    <div class="mb-3">
                        <label for="msnv" class="form-label">Mã Nhân Viên (MSNV)</label>
                        <input id="msnv" v-model="credentials.MSNV" class="form-control" placeholder="Nhập mã nhân viên"
                            required />
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Mật Khẩu</label>
                        <input id="password" v-model="credentials.Password" type="password" class="form-control"
                            placeholder="Nhập mật khẩu" required />
                    </div>
                    <div v-if="errorMessage" class="alert alert-danger" role="alert">
                        {{ errorMessage }}
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
                            {{ isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            credentials: {
                MSNV: '',
                Password: '',
            },
            errorMessage: '',
            isLoading: false,
        };
    },
    methods: {
        async dangNhap() {
            try {
                this.isLoading = true;
                this.errorMessage = '';
                await this.$store.dispatch('dangNhap', this.credentials);
                this.$router.push('/dashboard');
            } catch (err) {
                this.errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra mã nhân viên hoặc mật khẩu.';
            } finally {
                this.isLoading = false;
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
    max-width: 400px;
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
</style>