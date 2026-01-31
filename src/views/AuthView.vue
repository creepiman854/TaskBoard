<template>
  <main class="min-h-screen flex justify-center items-center">
    <Transition name="fade" mode="out-in">
      <section v-if="change" :class="section" :key="'register'">
        <form @submit.prevent="registerUser" :class="form">
          <div class="flex flex-col gap-5">
            <div :class="inputBox">
              <label class="user-label">Correo electrónico</label>
              <input v-model="email" required type="email" :class="input" />
            </div>
            <div :class="inputBox">
              <label class="user-label">Contraseña</label>
              <input v-model="password" required type="password" :class="input" />
            </div>
            <div :class="inputBox">
              <label class="user-label">Confirmar contraseña</label>
              <input
                v-model="confirmPassword"
                required
                type="password"
                autocomplete="off"
                :class="input"
              />
            </div>
          </div>
          <button :disabled="loading" class="button" :class="button">
            {{ loading ? "Creando cuenta..." : "Crear cuenta" }}
          </button>
        </form>
        <span
          >¿Ya tienes cuenta?
          <button @click="change = false" :class="link">Inicia sesión</button>.</span
        >
      </section>
      <section v-else :class="section" :key="'login'">
        <form @submit.prevent="loginUser" :class="form">
          <div class="flex flex-col gap-5">
            <div :class="inputBox">
              <label class="user-label">Correo electrónico</label>
              <input v-model="email" required type="email" :class="input" />
            </div>
            <div :class="inputBox">
              <label class="user-label">Contraseña</label>
              <input v-model="password" required type="password" :class="input" />
            </div>
          </div>
          <button :disabled="loading" class="button" :class="button">
            {{ loading ? "Iniciando sesión..." : "Iniciar sesión" }}
          </button>
        </form>
        <span
          >¿No tienes cuenta?
          <button @click="change = true" :class="link">Regístrate</button>.</span
        >
      </section>
    </Transition>
  </main>
</template>

<script setup>
import { computed, ref, watch } from "vue";
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

// LIMPIAR INPUTS AL CAMBIAR
watch(change, () => {
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
});

// REGISTRAR USUARIO
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
      background: "#e9e9e9",
      backdrop: "rgba(150, 150, 150, 0.4)",
      didOpen: () => {
        Swal.getContainer().style.backdropFilter = "blur(10px)";
      },
    }).then((result) => {
      if (result.isConfirmed) {
        change.value = false;
      }
    });
  } else {
    toast.error(res.message);
  }
};

// INICIAR SESIÓN
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

// ESTILOS
const section = "flex flex-col w-140 p-15 gap-15 items-center";
const form = "flex flex-col gap-10 justify-between h-full w-full";
const inputBox = "flex flex-col gap-2";
const input = "w-full py-3 px-5 outline-none";
const button = "w-full p-5 font-semibold text-xl";
const link = "link-style ml-1";
</script>

<!-- ESTILOS DE LA VISTA -->
<style lang="sass" scoped>
@import "@/assets/neumorphic.sass"

input
  @include inset(sm, 100vh)
  transition: all 0.2s ease
  &:focus
    filter: brightness(1.05)

section
  @include outset(lg, 45px)

.button
  @include outset(sm, 100vh, true)
  &:disabled
    opacity: 0.5
    cursor: not-allowed

.link-style
  display: inline-block
  color: inherit
  transition: all 0.2s ease
  cursor: pointer

  &:hover
    transform: translateY(-1px)
    text-shadow: 0.5px 0 0 currentColor
    filter: drop-shadow(0 3px 3px rgba(0,0,0,0.2))

// ANIMACIÓN DE CAMBIO
.fade-enter-active,
.fade-leave-active
  transition: all 0.3s ease

.fade-enter-from
  opacity: 0
  transform: translateY(10px)

.fade-leave-to
  opacity: 0
  transform: translateY(-10px)
</style>

<!-- ESTILOS DEL ALERT -->
<style lang="sass">
.swal2-popup.swal2-modal
  background: #e9e9e9
  border-radius: 30px
  box-shadow: 0px 4px 19px 3px #adadad;
  padding: 2.5rem

.swal2-title
  color: #444
  font-weight: 700

.swal2-html-container
  color: #666

.swal2-confirm.swal2-styled
  background: #e9e9e9 !important
  color: #555 !important
  border-radius: 100vh !important
  border: none !important
  font-weight: 600 !important
  padding: 0.8rem 2rem !important
  box-shadow: 5px 5px 10px #c6c6c6, -5px -5px 10px #ffffff !important
  transition: all 0.2s ease !important
  margin-top: 1.5rem !important

  &:hover
    box-shadow: 7px 7px 14px #bebebe, -7px -7px 14px #ffffff !important
    transform: translateY(-1px)

  &:active
    box-shadow: inset 3px 3px 6px #c6c6c6, inset -3px -3px 6px #ffffff !important
    transform: scale(0.98)

.swal2-icon.swal2-success
  border-color: #4ade80 !important
  margin-bottom: 1.5rem !important

  .swal2-success-ring
    border: .25em solid rgba(74, 222, 128, 0.2) !important

  [class^='swal2-success-line']
    background-color: #4ade80 !important
</style>

<!-- ESTILOS DEL TOAST -->
<style lang="sass">
@import "@/assets/neumorphic.sass"

.Vue-Toastification__toast
  @include outset(sm, 15px)
  background: #e9e9e9 !important
  color: #444 !important
  border-width: 2px !important
  border-style: solid !important
  box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff !important

  &--success
    border-color: #4ade80 !important
    .Vue-Toastification__icon
      color: #4ade80 !important

  &--error
    border-color: #f87171 !important
    .Vue-Toastification__icon
      color: #f87171 !important

  &--warning
    border-color: #fbbf24 !important
    .Vue-Toastification__icon
      color: #fbbf24 !important

  .Vue-Toastification__toast-body
    font-weight: 600 !important
</style>
