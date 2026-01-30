<template>
  <section v-if="change == true">
    <form @submit.prevent="registerUser">
      <div class="input-group">
        <input v-model="email" required type="email" autocomplete="off" class="input" />
        <label class="user-label">Correo electrónico</label>
      </div>
      <div class="input-group">
        <input v-model="password" required type="password" autocomplete="off" class="input" />
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
      <button :disabled="loading">{{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}</button>
    </form>
    <span>¿Ya tienes cuenta? <button @click="change = false">Inicia sesión</button>.</span>
  </section>
  <section v-if="change == false">
    <form @submit.prevent="loginUser">
      <div class="input-group">
        <input v-model="email" required type="email" autocomplete="off" class="input" />
        <label class="user-label">Correo electrónico</label>
      </div>
      <div class="input-group">
        <input v-model="password" required type="password" autocomplete="off" class="input" />
        <label class="user-label">Contraseña</label>
      </div>
      <button :disabled="loading">{{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}</button>
    </form>
    <span>¿No tienes cuenta? <button @click="change = true">Regístrate</button>.</span>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { register, login } from '@/services/auth'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'
import router from '@/router'

const toast = useToast()

const change = ref(false)
const loading = ref(false)

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const validPassword = computed(() => password.value === confirmPassword.value)

const registerUser = async () => {
  if (!validPassword.value) {
    toast.warning('Las constraseñas deben coincidir.')
    return
  }

  loading.value = true
  const res = await register(email.value, password.value)
  loading.value = false

  if (res.ok) {
    Swal.fire({
      title: '¡Cuenta creada!',
      text: 'Revisa tu correo y verifica tu cuenta para continuar',
      icon: 'success',
      confirmButtonText: 'Continuar',
    }).then((result) => {
      if (result.isConfirmed) {
        change.value = false
      }
    })
  } else {
    toast.error(res.message)
  }
}

const loginUser = async () => {
  loading.value = true
  const res = await login(email.value, password.value)
  loading.value = false

  if (res.ok) {
    toast.success(res.message)
    router.push('/')
  } else {
    toast.error(res.message)
  }
}
</script>

<style lang="sass" scoped>
/* From Uiverse.io by alexruix */

.input-group
  position: relative

  .input
    border: solid 1.5px #9e9e9e
    border-radius: 1rem
    background: none
    padding: 1rem
    font-size: 1rem
    transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1)

    &:focus,
    &:valid
      outline: none
      border: 1.5px solid #1a73e8

    &:focus ~ .user-label,
    &:valid ~ .user-label
      transform: translateY(-50%) scale(0.8)
      background-color: white
      padding: 0 0.2em
      color: #2196f3

  .user-label
    position: absolute
    left: 15px
    color: #B3B3B3
    pointer-events: none
    transform: translateY(1rem)
    transition: 150ms cubic-bezier(0.4, 0, 0.2, 1)
</style>
