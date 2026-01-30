<template>
  <div>TASKS</div>
  <button @click="userLogout">Cerrar sesión</button>
</template>

<script setup>
import router from "@/router";
import { logout } from "@/services/auth";
import { useToast } from "vue-toastification";

const toast = useToast();

const userLogout = async () => {
  const res = await logout();

  if (res.ok) {
    toast.success(res.message);
    router.push("/authentication");
  } else {
    toast.error(res.message);
  }
};
</script>

<style lang="scss" scoped></style>
