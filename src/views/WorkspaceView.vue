<template>
  <main class="min-h-screen flex flex-col">
    <header-component></header-component>

    <section class="flex-1 flex flex-col items-center gap-10 p-5 lg:p-10">
      <div v-if="isLoading" class="flex flex-col items-center gap-10 mt-20">
        <div class="wrapper-loader">
          <span></span>
        </div>
        <p class="text-gray-500 font-medium animate-pulse">Buscando tus tareas...</p>
      </div>

      <div v-else-if="isError" class="flex flex-col items-center gap-5 mt-20">
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" class="text-5xl text-red-400" />
        <p class="text-xl font-bold text-gray-600">Error al conectar con Firestore.</p>
        <button
          @click="printTask"
          class="p-3 px-10 border-none rounded-xl font-bold text-gray-500 bg-[#e9e9e9] shadow-[5px_5px_10px_#c6c6c6,-5px_-5px_10px_#ffffff] active:shadow-inner transition-all"
        >
          Reintentar
        </button>
      </div>

      <template v-else>
        <div v-if="tasksList.length > 0" class="tasksBox" :class="tasksBox">
          <div v-for="(task, index) in tasksList" :key="index" class="tasks" :class="tasks">
            <div class="flex flex-col gap-2 lg:gap-0 lg:flex-row items-center">
              <span v-if="task.completed" class="text-green-500">
                <font-awesome-icon icon="fa-solid fa-circle-check" />
              </span>
              <span v-else class="text-amber-500">
                <font-awesome-icon icon="fa-regular fa-clock" />
              </span>
              <p>{{ task.todo }}</p>
            </div>

            <span class="text-xs font-semibold opacity-50">
              {{ task.completed ? "Completada" : "En curso" }}
            </span>
          </div>
        </div>

        <div v-else class="flex flex-col items-center gap-5 mt-10">
          <img src="@/assets/images/no_task.png" alt="" class="h-50 opacity-80" />
          <span class="text-[#9e9e9e] font-medium italic"
            >No has asignado ninguna tarea todavía...</span
          >
        </div>
      </template>
    </section>
  </main>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import { getMyTasks } from "@/services/firestore";
import { onMounted, ref } from "vue";

const tasksList = ref([]);
const isLoading = ref(true);
const isError = ref(false);
let seconds = 0;

const printTask = async () => {
  isLoading.value = true;
  isError.value = false;
  seconds = 0;

  // Contador simple para error tras 8 segundos
  const timer = setInterval(() => {
    seconds++;
    if (seconds >= 8 && isLoading.value) {
      isLoading.value = false;
      isError.value = true;
      clearInterval(timer);
    }
  }, 1000);

  try {
    const res = await getMyTasks();
    tasksList.value = res;

    // Si carga antes del tiempo límite
    isLoading.value = false;
    clearInterval(timer);
  } catch (error) {
    console.error(error);
    isLoading.value = false;
    isError.value = true;
    clearInterval(timer);
  }
};

onMounted(() => printTask());

// ESTILOS
const tasksBox = "w-full max-w-5xl p-5 lg:p-10 flex flex-col gap-4 lg:gap-6 mb-10";
const tasks =
  "flex flex-col gap-5 text-sm lg:text-[15px] lg:flex-row text-center lg:text-left lg:justify-between items-center p-5 w-full transition-all duration-300";
</script>

<style lang="sass" scoped>
@import "@/assets/neumorphic.sass"

// SPINNER COMPACTO
.wrapper-loader
  position: relative
  display: flex
  justify-content: center
  align-items: center
  width: 100px
  height: 100px
  border-radius: 50%
  background: #e9e9e9
  box-shadow: inset -4px -4px 6px #ffffff, inset 4px 4px 6px rgba(0,0,0,0.1)

  &::before
    content: ''
    position: absolute
    width: 72px
    height: 72px
    border-radius: 50%
    background: #e9e9e9
    box-shadow: -4px -4px 6px #ffffff, 4px 4px 6px rgba(0,0,0,0.1)

  span
    position: absolute
    width: 80px
    height: 68px
    animation: rotate 2s linear infinite

    &::before
      content: ''
      position: absolute
      width: 10px
      height: 10px
      background: #49AAFB
      border-radius: 50%
      box-shadow: 0 0 5px #46A4F1

@keyframes rotate
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)

// ESTILOS DE LISTA
.tasksBox
  @include outset(lg, 30px)
  background: #e9e9e9

.tasks
  @include outset(sm, 20px)
  p
    margin-left: 12px
    font-weight: 500
  span
    display: flex
    align-items: center
</style>
