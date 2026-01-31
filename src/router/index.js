import { createRouter, createWebHistory } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: () => import("@/views/TasksView.vue"), meta: { requiresAuth: true } },
    {
      path: "/workspace",
      component: () => import("@/views/WorkspaceView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/authentication",
      component: () => import("@/views/AuthView.vue"),
      meta: { isLogged: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  onAuthStateChanged(auth, (userFirebase) => {
    if (to.meta.requiresAuth && !userFirebase) {
      next("/authentication");
    } else if (to.meta.isLogged && userFirebase) {
      next("/");
    } else {
      next();
    }
  });
});

export default router;
