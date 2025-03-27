// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import DangKy from "../views/dangKy.vue";
import DangNhap from "../views/dangNhap.vue";
import Dashboard from "../views/Dashboard.vue";
import ManageDocGia from "../views/manageDocGia.vue";
import ManageNhanVien from "../views/manageNhanVien.vue";
import ManageNhaXuatBan from "../views/manageNhaXuatBan.vue";
import ManageSach from "../views/manageSach.vue";
import ManageTheoDoiMuonSach from "../views/manageTheoDoiMuonSach.vue";

const routes = [
  {
    path: "/",
    redirect: (to) => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (token) {
        if (role === "docGia") return "/home";
        if (role === "nhanVien") return "/dashboard";
      }
      return "/dang-nhap";
    },
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true, role: "docGia" }, // Chỉ dành cho độc giả
  },
  {
    path: "/dang-ky",
    name: "DangKy",
    component: DangKy,
  },
  {
    path: "/dang-nhap",
    name: "DangNhap",
    component: DangNhap,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true, role: "nhanVien" }, // Chỉ dành cho nhân viên
  },
  {
    path: "/manage-doc-gia",
    name: "ManageDocGia",
    component: ManageDocGia,
    meta: { requiresAuth: true, role: "nhanVien" }, // Chỉ dành cho nhân viên
  },
  {
    path: "/manage-nhan-vien",
    name: "ManageNhanVien",
    component: ManageNhanVien,
    meta: { requiresAuth: true, role: "nhanVien" }, // Chỉ dành cho nhân viên
  },
  {
    path: "/manage-nha-xuat-ban",
    name: "ManageNhaXuatBan",
    component: ManageNhaXuatBan,
    meta: { requiresAuth: true, role: "nhanVien" }, // Chỉ dành cho nhân viên
  },
  {
    path: "/manage-sach",
    name: "ManageSach",
    component: ManageSach,
    meta: { requiresAuth: true, role: "nhanVien" }, // Chỉ dành cho nhân viên
  },
  {
    path: "/manage-theo-doi-muon-sach",
    name: "ManageTheoDoiMuonSach",
    component: ManageTheoDoiMuonSach,
    meta: { requiresAuth: true, role: "nhanVien" }, // Chỉ dành cho nhân viên
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Bảo vệ route dựa trên trạng thái đăng nhập và vai trò
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Nếu route yêu cầu đăng nhập
  if (to.meta.requiresAuth) {
    if (!token) {
      return next("/dang-nhap"); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    }
    if (to.meta.role && to.meta.role !== role) {
      return next("/dang-nhap"); // Chuyển hướng nếu vai trò không khớp
    }
  }

  // Nếu người dùng đã đăng nhập và cố truy cập trang đăng nhập/đăng ký
  if (token && (to.path === "/dang-nhap" || to.path === "/dang-ky")) {
    if (role === "nhanVien") {
      return next("/dashboard"); // Chuyển hướng nhân viên đến dashboard
    } else if (role === "docGia") {
      return next("/"); // Chuyển hướng độc giả đến trang Home
    }
  }

  next();
});

export default router;
