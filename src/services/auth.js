import { auth } from "@/firebase/config";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { ref } from "vue";

export const user = ref(null);

onAuthStateChanged(auth, (userFirebase) => {
  console.log(userFirebase?.email || "None");

  user.value = userFirebase;
});

export const register = async (email, password) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created");

    return {
      ok: true,
      message: "Cuenta creada.",
      user: userCredentials,
    };
  } catch (error) {
    console.log("REGISTER ERROR: ", error);

    return {
      ok: false,
      message: "No se ha podido crear la cuenta.",
    };
  }
};

export const login = async (email, password) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged");

    return {
      ok: true,
      message: "Sesión iniciada.",
      user: userCredentials,
    };
  } catch (error) {
    console.log("LOGIN ERROR: ", error);

    return {
      ok: false,
      message: "No se ha podido iniciar sesión.",
    };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");

    return {
      ok: true,
      message: "Sesión cerrada.",
    };
  } catch (error) {
    console.log("LOGOUT ERROR: ", error);

    return {
      ok: false,
      message: "No se ha podido cerrar sesión.",
    };
  }
};

export const sendVerification = async (email) => {
  try {
    if (auth.currentUser.emailVerified) {
      console.log("User verified");
      return;
    }

    await sendEmailVerification(email);

    return {
      ok: true,
      message: "Email de verificación enviado.",
    };
  } catch (error) {
    console.log("VERIFICATION EMAIL ERROR: ", error);

    return {
      ok: false,
      message: "No se ha podido enviar el correo de verificación.",
    };
  }
};
