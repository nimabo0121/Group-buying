/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/default",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("@/pages/index.vue"),
        meta: { title: "首頁" },
      },
      {
        path: "/shophome",
        name: "shophome",
        component: () => import("@/pages/shopviews/index.vue"),
        meta: { title: "商店首頁" },
      },
      {
        path: "/officialviews",
        name: "official",
        component: () => import("@/pages/officialviews/index.vue"),
        meta: { title: "管理中心" },
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("TokenUid"); // 檢查 Token
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: "home" });
    } else {
      next();
    }
  } else {
    next();
  }
});
// 更新頁面Title
router.beforeEach((to, from, next) => {
  const defaultTitle = "永泓股份有限公司";
  document.title = to.meta?.title || defaultTitle;
  next();
});

export default router;
