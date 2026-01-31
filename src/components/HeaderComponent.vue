<template>
  <div class="sticky top-0 z-50 py-5">
    <header class="p-8 flex flex-row justify-center items-center gap-20 mx-10 relative shadow-2xl rounded-full">
      <nav class="flex gap-30">
        <router-link to="/" class="nav-link">Tareas</router-link>
        <router-link to="/workspace" class="nav-link">Área de trabajo</router-link>
      </nav>
      <button @click="userLogout" class="logout-btn">
        <font-awesome-icon icon="fa-solid fa-right-from-bracket" size="xl" />
      </button>
    </header>
  </div>
</template>

<script setup>
import router from "@/router";
import { logout } from "@/services/auth";
import { useToast } from "vue-toastification";

const toast = useToast();

// CERRAR SESIÓN
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

<style lang="sass" scoped>
@import "@/assets/neumorphic.sass"

header
  background: #e9e9e9

.logout-btn
  @include outset(sm, 50%, true) // Botón circular neumórfico
  position: absolute
  right: 0
  margin-right: 2rem
  width: 50px
  height: 50px
  display: flex
  align-items: center
  justify-content: center
  color: #444

.nav-link
  transition: all 0.2s ease
  &:hover
    text-shadow: 0.5px 0 0 currentColor
    transform: translateY(-1px)
</style>
