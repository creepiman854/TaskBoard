<template>
  <div>
    <h1>TAREAS</h1>
    <button @click="userLogout" class="border">Cerrar sesión</button>
    <router-link to="/workspace">Workspace</router-link>
    <select v-model="taskStatus">
      <option value="" disabled hidden selected>Estado de la tarea</option>
      <option value="all">Todas</option>
      <option value="finished">Finalizada</option>
      <option value="unfinished">En proceso</option>
      <option value="assigned">Asignada</option>
    </select>
    <section>
      <div
        class="flex flex-row justify-between w-250 border"
        v-for="(task, index) in filteredTask"
        :key="index"
      >
        <div class="flex flex-row">
          <span v-if="task.completed">✅</span>
          <span v-else>🥸</span>
          <p>{{ task.todo }}</p>
        </div>
        <button
          class="border disabled:bg-amber-600"
          @click="addTask(task)"
          :disabled="task.assigned || task.completed"
        >
          Asignar tarea
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import router from "@/router";
import { logout } from "@/services/auth";
import { useToast } from "vue-toastification";
import { setTask, getTask } from "@/services/firestore";
import { useTaskStore } from "@/stores/taskStore";
import { auth } from "@/firebase/config";

const toast = useToast();
const taskStore = useTaskStore();

const taskStatus = ref("");
const tasksListFirestore = ref([]);

// CONSEGUIR TAREAS DEL FIRESTORE
const getTaskFirestore = async () => {
  tasksListFirestore.value = await getTask();
};

// ASIGNAR TAREA
const addTask = async (task) => {
  const res = await setTask(task);

  if (res.ok) {
    toast.success(res.message);

    tasksListFirestore.value.push({
      id: task.id,
      assigned: true,
      userId: auth.currentUser.uid,
      todo: task.todo,
      completed: task.completed,
    });
  } else {
    toast.error(res.message);
  }
};

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

const filteredTask = computed(() => {
  const copyTask = taskStore.tasksList.map((task) => {
    const isAssigned = tasksListFirestore.value.some((t) => Number(t.id) === task.id);
    return {
      ...task,
      assigned: isAssigned,
    };
  });

  if (taskStatus.value === "finished") {
    return copyTask.filter((task) => task.completed);
  }
  if (taskStatus.value === "unfinished") {
    return copyTask.filter((task) => !task.completed);
  }
  if (taskStatus.value === "assigned") {
    return copyTask.filter((task) => task.assigned);
  }

  return copyTask;
});

onMounted(async () => {
  await taskStore.getTask();
  await getTaskFirestore();
});
</script>

<style lang="scss" scoped></style>
