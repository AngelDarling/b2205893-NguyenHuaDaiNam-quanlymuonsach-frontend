import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import DangKy from "../views/dangKy.vue";
import DangNhap from "../views/dangNhap.vue";
import DanhSachSach from "../views/DanhSachSach.vue";
import Dashboard from "../views/Dashboard.vue";
import ManageDocGia from "../views/manageDocGia.vue";
import ManageNhanVien from "../views/manageNhanVien.vue";
import ManageNhaXuatBan from "../views/manageNhaXuatBan.vue";
import ManageSach from "../views/manageSach.vue";
import ManageTheoDoiMuonSach from "../views/manageTheoDoiMuonSach.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/dang-ky", name: "DangKy", component: DangKy },
  { path: "/dang-nhap", name: "DangNhap", component: DangNhap },
  { path: "/danh-sach-sach", name: "DanhSachSach", component: DanhSachSach },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/manage-doc-gia", name: "ManageDocGia", component: ManageDocGia },
  {
    path: "/manage-nhan-vien",
    name: "ManageNhanVien",
    component: ManageNhanVien,
  },
  {
    path: "/manage-nha-xuat-ban",
    name: "ManageNhaXuatBan",
    component: ManageNhaXuatBan,
  },
  { path: "/manage-sach", name: "ManageSach", component: ManageSach },
  {
    path: "/manage-theo-doi-muon-sach",
    name: "ManageTheoDoiMuonSach",
    component: ManageTheoDoiMuonSach,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
