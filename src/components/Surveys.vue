<script setup lang="ts">
import axios from "axios";
import { provide, reactive, watchEffect, ref, onMounted } from "vue";
import { Survey } from "../types/survey";
import OneSurvey from "./OneSurvey.vue";
import { logout } from "@/api/auth";
import { useRouter } from "vue-router";
import { getAuthDataFromStorage } from "@/utils/auth-data";

const router = useRouter();

interface ErrorData {
  response: Response;
}

interface Response {
  data: [];
}

const surveysBeforeReactive = new Map<number, Survey>();
const surveys = reactive(surveysBeforeReactive);

const validations = ref<string[]>([]);

const surveyState = reactive({
  title: "",
  description: "",
});

watchEffect((): void => {
  const fetchSurveys = async () => {
    try {
      const response = await axios.get("http://localhost:3000/surveys", {
        headers: {
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      });
      response.data.forEach((obj) => {
        surveys.set(obj.id, {
          id: obj.id,
          title: obj.title,
          description: obj.description,
        });
      });
      console.log("success");
    } catch (error) {
      console.log(error);
    }
  };

  fetchSurveys();
});

function handleCreate(): void {
  const createSurvey = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/surveys",
        {
          title: surveyState.title,
          description: surveyState.description,
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
      surveys.set(res.id, {
        id: res.id,
        title: res.title,
        description: res.description,
      });
      surveyState.title = "";
      surveyState.description = "";
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

  createSurvey();
}

const handleLogout = async () => {
  await logout().then((res) => {
    if (res.status === 200) {
      console.log(res);
      router.push({ path: "/login" });
    } else {
      alert("メールアドレスかパスワードが間違っています");
    }
  });
};

provide("surveys", surveys);

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
        router.push({ path: "/login" });
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
      router.push({ path: "/login" });
    }
  };

  autoLogin();
});
</script>

<template>
  <h1 class="my-5">・アンケート一覧</h1>

  <OneSurvey
    v-for="survey in surveys.values()"
    v-bind:key="survey.id"
    v-bind:id="survey.id"
    v-bind:title="survey.title"
    v-bind:description="survey.description"
  />

  <div class="border rounded-lg bg-white">
    <v-form v-on:submit.prevent="handleCreate">
      <v-container>
        <h2 class="mb-5">・新規アンケート作成</h2>
        <div v-for="validation in validations" :key="validation">
          <p class="text-red-lighten-1">{{ validation }}</p>
        </div>
        <v-row>
          <v-col cols="12" md="20">
            <v-text-field
              type="text"
              placeholder="タイトル"
              v-model="surveyState.title"
          /></v-col>
          <v-col cols="12" md="20">
            <v-textarea
              placeholder="詳細"
              v-model="surveyState.description"
            ></v-textarea
          ></v-col>
          <v-col cols="12" md="4"> <v-btn type="submit">作成</v-btn></v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
  <button v-on:click="handleLogout">ログアウト</button>
</template>
