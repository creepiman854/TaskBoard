import { auth, db } from "@/firebase/config";
import { setDoc, getDocs, doc, collection, where, query } from "firebase/firestore";

export const setTask = async (data) => {
  try {
    const docRef = doc(db, "assignedTasks", String(data.id));

    await setDoc(
      docRef,
      {
        assigned: true,
        userId: auth.currentUser.uid,
        todo: data.todo,
        completed: data.completed,
      },
      { merge: true },
    );

    return { ok: true, message: "Tarea añadida." };
  } catch (error) {
    return { ok: false, message: "Error al asignar." };
  }
};

export const getTask = async () => {
  const colRef = collection(db, "assignedTasks");
  const querySnapshot = await getDocs(colRef);
  return querySnapshot.docs.map((doc) => ({ id: Number(doc.id), ...doc.data() }));
};

export const getMyTasks = async () => {
  const colRef = collection(db, "assignedTasks");
  const q = query(colRef, where("userId", "==", auth.currentUser.uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
