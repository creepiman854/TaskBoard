<template>
  <div>WORKSPACE</div>
  <section>
    <div
      class="flex flex-row justify-between w-250 border"
      v-for="(task, index) in tasksList"
      :key="index"
    >
      <div class="flex flex-row">
        <span v-if="task.completed">✅</span>
        <span v-else>🥸</span>
        <p>{{ task.todo }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { getTask } from "@/services/firestore";
import { onMounted, ref } from "vue";

const tasksList = ref([]);

const printTask = async () => {
  try {
    const res = await getTask();

    if (res.ok) {
      tasksList.value = res.data;
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => printTask());
</script>

<style lang="scss" scoped></style>
