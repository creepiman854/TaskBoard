import { createRouter, createWebHistory } from "vue-router";
import { user } from "@/services/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: () => import("@/views/TasksView.vue"), meta: { requiresAuth: true } },
    {
      path: "/dashboard",
      component: () => import("@/views/DashboardView.vue"),
      meta: { requiresAuth: true },
    },
    { path: "/authentication", component: () => import("@/views/AuthView.vue") },
  ],
});

onAuthStateChanged(auth, (userFirebase) => {
  user.value = userFirebase;

  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !user.value) {
      next("/authentication");
    } else {
      next();
    }
  });
});

export default router;
