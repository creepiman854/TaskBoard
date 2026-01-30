import { auth } from '@/firebase/config'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from 'firebase/auth'
import { ref } from 'vue'

export const user = ref(null)

onAuthStateChanged(auth, (userFirebase) => {
  console.log(userFirebase?.email || 'None')

  user.value = userFirebase
})

export const register = async (email, password) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
    user.value = userCredentials?.user

    await sendEmailVerification(user.value, {
      url: window.location.origin + '/',
    })

    console.log('User created')

    return {
      ok: true,
      message: 'Revisa tu correo y verifica tu cuenta para continuar',
      user: userCredentials,
    }
  } catch (error) {
    console.log('REGISTER ERROR: ', error)

    return {
      ok: false,
      message: 'No se ha podido crear la cuenta.',
    }
  }
}

export const login = async (email, password) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password)
    user.value = userCredentials?.user

    if (!user.value.emailVerified) {
      await signOut(auth)

      return {
        ok: false,
        message: 'Debes verificar tu email para iniciar sesión.',
      }
    }

    console.log('User logged')

    return {
      ok: true,
      message: 'Sesión iniciada.',
      user: userCredentials,
    }
  } catch (error) {
    console.log('LOGIN ERROR: ', error)

    return {
      ok: false,
      message: 'No se ha podido iniciar sesión.',
    }
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
    console.log('User logged out')

    return {
      ok: true,
      message: 'Sesión cerrada.',
    }
  } catch (error) {
    console.log('LOGOUT ERROR: ', error)

    return {
      ok: false,
      message: 'No se ha podido cerrar sesión.',
    }
  }
}
