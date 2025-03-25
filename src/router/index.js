import { createRouter, createWebHistory } from "vue-router";
import DangNhap from "../views/DangNhap.vue";
import Dashboard from "../views/Dashboard.vue";
import DanhSachSach from "../views/DanhSachSach.vue";

const routes = [
  { path: "/", redirect: "/dangnhap" },
  { path: "/dangnhap", component: DangNhap },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/danhsachsach", component: DanhSachSach },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    next("/dangnhap");
  } else {
    next();
  }
});

export default router;
