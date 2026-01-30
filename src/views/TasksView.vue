<template>
  <div>
    <h1>TAREAS</h1>
    <button @click="userLogout">Cerrar sesión</button>
    <div>
      <task-card
        v-for="(task, index) in taskStore.tasksList"
        :key="index"
        :taskName="task.todo"
        :taskState="task.completed"
      ></task-card>
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import { logout } from "@/services/auth";
import { useToast } from "vue-toastification";
import TaskCard from "@/components/TaskCard.vue";

import { useTaskStore } from "@/stores/taskStore";
import { onMounted } from "vue";

const toast = useToast();

const taskStore = useTaskStore();

const userLogout = async () => {
  const res = await logout();

  if (res.ok) {
    toast.success(res.message);
    router.push("/authentication");
  } else {
    toast.error(res.message);
  }
};

onMounted(async () => {
  await taskStore.getTask();
  console.log(taskStore?.tasksList);
});
</script>

<style lang="scss" scoped></style>
