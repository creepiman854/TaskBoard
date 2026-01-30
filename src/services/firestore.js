import { db } from "@/firebase/config";
import { addDoc, getDocs, collection } from "firebase/firestore";

export const setTask = async (user, data) => {
  try {
    const docRef = collection(db, "users", user.uid, "tasks");
    await addDoc(docRef, data);

    return {
      ok: true,
    };
  } catch (error) {
    console.log("ADDDOC ERROR: ", error);

    return {
      ok: false,
    };
  }
};

export const getTask = async (user) => {
  try {
    const docRef = collection(db, "users", user.uid, "tasks");
    const docSnap = await getDocs(docRef);

    const tasksList = [];

    docSnap.forEach((task) => tasksList.push(task));

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
