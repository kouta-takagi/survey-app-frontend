<script setup lang="ts">
import { useMessage } from "@/composables/useMessage";
import Surveys from "../components/Surveys.vue";

const { message } = useMessage();

const showMessage = () => {
  debugger;
  message("新規作成が完了しました", { autoHide: true, hideTime: 30000 });
};
</script>

<template>
  <Surveys />
  <button @click="showMessage">フラッシュメッセージを表示</button>
</template>
