<script setup lang="ts">
import axios from "axios";
// import type { AxiosError } from "axios";
import { onMounted, reactive, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import type { Question } from "@/types/question";
import { getAuthDataFromStorage } from "@/utils/auth-data";
import { useRouter } from "vue-router";
import { useMessage } from "@/composables/useMessage";

const { message } = useMessage();

const route = useRoute("/surveys/[id]");

const router = useRouter();

const isFinished = ref(false);

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
      isFinished.value = true;
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  createAnswers();
}

onMounted(() => {
  const autoLogin = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/validate_token",
        {
          headers: getAuthDataFromStorage(),
        }
      );
      if (response.status !== 200) {
        console.error(response);
        message("ログインしてください", { autoHide: true, hideTime: 3000 });
        router.push({ path: "/login" });
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
      message("ログインしてください", { autoHide: true, hideTime: 3000 });
      router.push({ path: "/login" });
    }
  };

  autoLogin();
});
</script>

<template>
  <div v-if="isFinished">
    回答が終了しました。お疲れ様でした！画面を閉じてください。
  </div>
  <div v-else>
    <div v-if="questions.size === 0">問題がありません</div>
    <div v-else>
      <form v-on:submit.prevent="handleAnswer">
        <div v-for="question in questions.values()" :key="question.id">
          <h1>{{ question.content }}</h1>
          <v-text-field type="text" v-model="answers[String(question.id)]" />
        </div>
        <v-btn type="submit">回答する</v-btn>
      </form>
    </div>
  </div>
</template>
