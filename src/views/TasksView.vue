<template>
  <main class="min-h-screen flex flex-col">
    <header-component></header-component>
    <section class="flex-1 flex flex-col items-center gap-10 p-5 lg:p-10">
      <div v-if="isLoading" class="flex flex-col items-center gap-10 mt-20">
        <div class="wrapper-loader">
          <span></span>
        </div>
        <p class="text-gray-500 font-medium animate-pulse">Cargando tareas...</p>
      </div>

      <div v-else-if="isError" class="flex flex-col items-center gap-5 mt-20">
        <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="text-5xl text-red-400" />
        <p class="text-xl font-bold text-gray-600">Error al cargar los datos.</p>
        <button @click="loadData" class="button px-10">Reintentar</button>
      </div>

      <template v-else>
        <select v-model="taskStatus" class="p-3 w-full lg:w-150 text-center">
          <option value="" disabled hidden selected>Estado de la tarea</option>
          <option value="all">Todas</option>
          <option value="finished">Finalizada</option>
          <option value="unfinished">En proceso</option>
          <option value="assigned">Asignada</option>
        </select>

        <div :class="tasksBox" class="tasksBox">
          <div class="tasks" :class="tasks" v-for="(task, index) in filteredTask" :key="index">
            <div class="flex flex-col lg:flex-row">
              <span v-if="task.completed" class="text-green-500"
                ><font-awesome-icon icon="fa-solid fa-circle-check"
              /></span>
              <span v-else class="text-amber-500"
                ><font-awesome-icon icon="fa-solid fa-clock"
              /></span>
              <p>{{ task.todo }}</p>
            </div>
            <button
              class="border disabled:bg-amber-600 w-full lg:w-auto"
              @click="addTask(task)"
              :disabled="task.assigned || task.completed"
            >
              Asignar tarea
            </button>
          </div>
        </div>
      </template>
    </section>
  </main>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import { onMounted, ref, computed } from "vue";
import { useToast } from "vue-toastification";
import { setTask, getTask } from "@/services/firestore";
import { useTaskStore } from "@/stores/taskStore";
import { auth } from "@/firebase/config";

const toast = useToast();
const taskStore = useTaskStore();

// MANEJO DE TAREAS
const taskStatus = ref("");
const tasksListFirestore = ref([]);

// ESTADOS DE CARGA
const isLoading = ref(true);
const isError = ref(false);
let seconds = 0;

// OBTENER TAREAS DE FIRESTORE
const getTaskFirestore = async () => {
  tasksListFirestore.value = await getTask();
};

// TIMER DE CARGA DE TAREAS
const loadData = async () => {
  isLoading.value = true;
  isError.value = false;
  seconds = 0;

  const timer = setInterval(() => {
    seconds++;
    if (seconds >= 8 && isLoading.value) {
      isLoading.value = false;
      isError.value = true;
      clearInterval(timer);
    }
  }, 1000);

  try {
    await taskStore.getTask();
    await getTaskFirestore();

    isLoading.value = false;
    clearInterval(timer);
  } catch (error) {
    console.log(error);

    isLoading.value = false;
    isError.value = true;
    clearInterval(timer);
  }
};

// ASIGNAR TAREAS
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

// FILTRO DE TAREAS + COMPROBACIÓN DE SI ESTÁ ASIGNADA
const filteredTask = computed(() => {
  const copyTask = taskStore.tasksList.map((task) => {
    const isAssigned = tasksListFirestore.value.some((t) => Number(t.id) === task.id);
    return { ...task, assigned: isAssigned };
  });

  if (taskStatus.value === "finished") return copyTask.filter((task) => task.completed);
  if (taskStatus.value === "unfinished") return copyTask.filter((task) => !task.completed);
  if (taskStatus.value === "assigned") return copyTask.filter((task) => task.assigned);
  return copyTask;
});

onMounted(() => loadData());

// ESTILOS
const tasksBox = "w-full max-w-5xl p-5 lg:p-10 flex flex-col gap-4 lg:gap-6 mb-10";
const tasks =
  "flex flex-col gap-5 text-sm lg:text-[15px] lg:flex-row text-center lg:text-left lg:justify-between items-center p-5 w-full transition-all duration-300";
</script>

<style lang="sass" scoped>
@import "@/assets/neumorphic.sass"

// SPINNER
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

// PAGINA
select
  @include outset(sm, 100vh, true)
  cursor: pointer
  outline: none
  border: none
  appearance: none

.tasksBox
  @include outset(lg, 30px)
  background: #e9e9e9

.tasks
  @include outset(sm, 20px)
  p
    margin-left: 12px
    font-weight: 500

button
  @include outset(sm, 10px, true)
  padding: 8px 16px
  font-size: 0.875rem
  font-weight: 600
  color: #555
  &:disabled
    opacity: 0.5
    cursor: not-allowed
    transform: scale(1)
    &::before, &::after
      display: none
</style>

<!-- ESTILOS DEL TOAST -->
<style lang="sass">
@import "@/assets/neumorphic.sass"

.Vue-Toastification__toast
  @include outset(sm, 15px)
  background: #e9e9e9 !important
  color: #444 !important
  border-width: 2px !important
  border-style: solid !important
  box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff !important

  @media (max-width: 640px)
    min-width: 250px !important
    max-width: 90vw !important
    margin-right: auto !important
    margin-left: auto !important
    padding: 12px !important
    align-items: center !important

  &--success
    border-color: #4ade80 !important
    .Vue-Toastification__icon
      color: #4ade80 !important

  &--error
    border-color: #f87171 !important
    .Vue-Toastification__icon
      color: #f87171 !important

  &--warning
    border-color: #fbbf24 !important
    .Vue-Toastification__icon
      color: #fbbf24 !important

  .Vue-Toastification__toast-body
    font-weight: 600 !important
</style>
