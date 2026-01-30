import { auth, db } from "@/firebase/config";
import { setDoc, getDocs, doc, collection } from "firebase/firestore";

export const setTask = async (data) => {
  try {
    const docRef = doc(db, "users", auth.currentUser.uid, "tasks", String(data.id));
    await setDoc(docRef, {
      todo: data.todo,
      completed: data.completed,
      asigned: true,
    });

    return {
      ok: true,
      message: "Tarea añadida.",
    };
  } catch (error) {
    console.log("ADDDOC ERROR: ", error);

    return {
      ok: false,
      message: "No se ha podido añadir la tarea.",
    };
  }
};

export const getTask = async () => {
  try {
    const docRef = collection(db, "users", auth.currentUser.uid, "tasks");
    const docSnap = await getDocs(docRef);

    const tasksList = [];

    docSnap.forEach((task) => tasksList.push(task.data()));
    console.log(tasksList);

    return {
      ok: true,
      data: tasksList,
    };
  } catch (error) {
    console.log("GETDOCS ERROR: ", error);

    return {
      ok: false,
    };
  }
};
