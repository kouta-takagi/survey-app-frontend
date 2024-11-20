<script setup lang="ts">
import { watchEffect, reactive, ref, provide } from "vue";
import type { Question } from "../types/question";
import axios from "axios";
import OneQuestion from "./OneQuestion.vue";
import { useMessage } from "@/composables/useMessage";

const { message } = useMessage();

interface Props {
  survey_id: number;
}

interface ErrorData {
  response: Response;
}

interface Response {
  data: [];
}

const props = defineProps<Props>();

const questionState = ref("");

const validations = ref<string[]>([]);

const questionsBeforeReactive = new Map<number, Question>();
const questions = reactive(questionsBeforeReactive);

watchEffect((): void => {
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/surveys/${props.survey_id}/questions`,
        {
          headers: {
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid"),
          },
        }
      );
      response.data.forEach((obj) => {
        questions.set(obj.id, {
          id: obj.id,
          content: obj.content,
          survey_id: obj.survey_id,
        });
      });
      console.log("success");
    } catch (error) {
      console.log(error);
    }
  };

  fetchQuestions();
});

function handleCreate(): void {
  const createQuestion = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/surveys/${props.survey_id}/questions`,
        {
          content: questionState.value,
        },
        {
          headers: {
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid"),
          },
        }
      );
      const res = response.data;
      questions.set(res.id, {
        id: res.id,
        content: res.content,
        survey_id: res.survey_id,
      });
      questionState.value = "";
      validations.value = [];
      message("新しい質問を作成しました", { autoHide: true, hideTime: 3000 });
    } catch (error) {
      if (typeof error !== "object" || error === null) {
        return false;
      }

      const errorData = error as Record<keyof ErrorData, unknown>;
      if (typeof errorData.response !== "object") {
        return false;
      }

      const response = errorData.response as Record<keyof Response, unknown>;
      if (!Array.isArray(response.data)) {
        return false;
      }

      if (typeof response.data === "string") {
        return false;
      }

      validations.value = response.data;
    }
  };

  createQuestion();
}

provide("questions", questions);
</script>

<template>
  <h2>・質問一覧</h2>

  <OneQuestion
    v-for="question in questions.values()"
    v-bind:key="question.id"
    v-bind:id="question.id"
    v-bind:content="question.content"
    v-bind:survey_id="question.survey_id"
  />

  <form v-on:submit.prevent="handleCreate">
    <h3 class="my-2">・新規質問作成</h3>

    <div v-for="validation in validations" :key="validation">
      <p class="text-red-lighten-1">{{ validation }}</p>
    </div>

    <v-text-field type="text" placeholder="内容" v-model="questionState" />
    <v-btn type="submit">作成</v-btn>
  </form>
</template>
