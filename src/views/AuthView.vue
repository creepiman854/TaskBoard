<template>
  <section v-if="change == true">
    <form @submit.prevent="registerUser">
      <div class="input-group">
        <input v-model="email" required type="email" class="input" />
        <label class="user-label">Correo electrónico</label>
      </div>
      <div class="input-group">
        <input v-model="password" required type="password" class="input" />
        <label class="user-label">Contraseña</label>
      </div>
      <div class="input-group">
        <input
          v-model="confirmPassword"
          required
          type="password"
          autocomplete="off"
          class="input"
        />
        <label class="user-label">Confirmar contraseña</label>
      </div>
      <button :disabled="loading">{{ loading ? "Creando cuenta..." : "Crear cuenta" }}</button>
    </form>
    <span>¿Ya tienes cuenta? <button @click="change = false">Inicia sesión</button>.</span>
  </section>
  <section v-if="change == false">
    <form @submit.prevent="loginUser">
      <div class="input-group">
        <label class="user-label">Correo electrónico</label>
        <input v-model="email" required type="email" class="input" />
      </div>
      <div class="input-group">
        <label class="user-label">Contraseña</label>
        <input v-model="password" required type="password" class="input" />
      </div>
      <button :disabled="loading">{{ loading ? "Iniciando sesión..." : "Iniciar sesión" }}</button>
    </form>
    <span>¿No tienes cuenta? <button @click="change = true">Regístrate</button>.</span>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { register, login } from "@/services/auth";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import router from "@/router";

const toast = useToast();

const change = ref(false);
const loading = ref(false);

const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const validPassword = computed(() => password.value === confirmPassword.value);

const registerUser = async () => {
  if (!validPassword.value) {
    toast.warning("Las constraseñas deben coincidir.");
    return;
  }

  loading.value = true;
  const res = await register(email.value, password.value);
  loading.value = false;

  if (res.ok) {
    Swal.fire({
      title: "¡Cuenta creada!",
      text: "Revisa tu correo y verifica tu cuenta para continuar",
      icon: "success",
      confirmButtonText: "Continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        change.value = false;
      }
    });
  } else {
    toast.error(res.message);
  }
};

const loginUser = async () => {
  loading.value = true;
  const res = await login(email.value, password.value);
  loading.value = false;

  if (res.ok) {
    toast.success(res.message);
    router.push("/");
  } else {
    toast.error(res.message);
  }
};
</script>

<style lang="sass" scoped>
@import "./assets/neumorphic.sass";
</style>
