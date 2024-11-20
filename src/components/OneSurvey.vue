<script setup lang="ts">
import { inject, ref } from "vue";
import type { Survey } from "../types/survey";
import Questions from "./Questions.vue";
import { RouterLink } from "vue-router";
import axios from "axios";
import { useMessage } from "@/composables/useMessage";

const { message } = useMessage();

interface Props {
  id: number;
  title: string;
  description: string;
}

const isOpen = ref(false);

const props = defineProps<Props>();

const surveys = inject("surveys") as Map<number, Survey>;

const survey = surveys.get(props.id) as Survey;

function handleToggle() {
  isOpen.value = !isOpen.value;
}

function handleDelete() {
  axios
    .delete(`http://localhost:3000/surveys/${props.id}`, {
      headers: {
        "access-token": localStorage.getItem("access-token"),
        client: localStorage.getItem("client"),
        uid: localStorage.getItem("uid"),
      },
    })
    .then(() => {
      message("アンケートの削除が完了しました", {
        autoHide: true,
        hideTime: 3000,
      });
    });
}
</script>

<template>
  <v-card class="mx-auto mb-6" width="400">
    <template v-slot:title>
      <span class="font-weight-black">{{ survey.title }}</span>
    </template>

    <RouterLink
      :to="{
        path: `/surveys/${props.id}`,
      }"
    >
      このアンケートのURL
    </RouterLink>
    <button v-on:click="handleDelete">このアンケートを削除する</button>

    <v-card-text class="bg-surface-light pt-4">
      <div class="d-flex justify-space-between">
        <div>{{ survey.description }}</div>
        <v-btn v-on:click="handleToggle">
          問題一覧を{{ isOpen ? "非表示" : "表示" }}
        </v-btn>
      </div>
      <Questions v-if="isOpen" v-bind:survey_id="survey.id" />
    </v-card-text>
  </v-card>
</template>
