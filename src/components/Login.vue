<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { login } from "@/api/auth";
import axios from "axios";
import { getAuthDataFromStorage } from "@/utils/auth-data";
import { useRouter } from "vue-router";
import { useMessage } from "@/composables/useMessage";

const { message } = useMessage();

const router = useRouter();

const formData = reactive({
  email: "",
  password: "",
});
const handleLogin = async () => {
  await login(formData.email, formData.password).then((res) => {
    if (res.status === 200) {
      console.log(res);
      message("ログインしました", { autoHide: true, hideTime: 3000 });
      router.push({ path: "/" });
    } else {
      message("メールアドレスかパスワードが間違っています", {
        autoHide: true,
        hideTime: 3000,
      });
    }
  });
};

onMounted(() => {
  const autoLogin = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/validate_token",
        {
          headers: getAuthDataFromStorage(),
        }
      );
      if (response.status === 200) {
        router.push({ path: "/" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  autoLogin();
});
</script>

<template>
  <v-form v-on:submit.prevent="handleLogin">
    <v-container>
      <h2 class="mb-5">・ログイン</h2>
      <v-row>
        <v-col cols="12" md="20">
          <v-text-field
            type="email"
            placeholder="メールアドレス"
            v-model="formData.email"
        /></v-col>
        <v-col cols="12" md="20">
          <v-text-field
            type="text"
            placeholder="パスワード"
            v-model="formData.password"
        /></v-col>
        <v-col cols="12" md="4"> <v-btn type="submit">ログイン</v-btn></v-col>
      </v-row>
    </v-container>
  </v-form>
  <RouterLink
    :to="{
      path: `/signup`,
    }"
  >
    新規登録ページへ
  </RouterLink>
</template>
