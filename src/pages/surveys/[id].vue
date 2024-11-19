<script setup lang="ts">
import axios from "axios";
import { reactive, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Question } from "@/types/question";

const route = useRoute("/surveys/[id]");
const router = useRouter();

const questionsBeforeReactive = new Map<number, Question>();
const questions = reactive(questionsBeforeReactive);
const answers: Record<string, string> = reactive({});

watchEffect((): void => {
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/surveys/${route.params.id}/questions`,
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
        answers[String(obj.id)] = "";
      });
      console.log("success");
    } catch (error) {
      console.log(error);
    }
  };

  fetchQuestions();
});

function handleAnswer(): void {
  const createAnswers = async () => {
    try {
      debugger;
      await axios.post(
        `http://localhost:3000/surveys/${route.params.id}/answers`,
        { answers },
        {
          headers: {
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid"),
          },
        }
      );
      router.push({ path: "/" });
    } catch (error) {
      console.log(error);
    }
  };

  createAnswers();
}
</script>

<template>
  <div v-if="questions.size === 0">問題がありません</div>
  <div v-else>
    <form v-on:submit.prevent="handleAnswer">
      <div v-for="question in questions.values()" :key="question.id">
        <h1>{{ question.content }}</h1>
        <v-text-field
          type="text"
          v-model="answers[String(question.id)]"
          required
        />
      </div>
      <v-btn type="submit">回答する</v-btn>
    </form>
  </div>
</template>
