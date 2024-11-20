<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { signUp } from "@/api/auth";
import { getAuthDataFromStorage } from "@/utils/auth-data";
import { useRouter } from "vue-router";
import axios from "axios";
import { useMessage } from "@/composables/useMessage";

const { message } = useMessage();

const router = useRouter();

const formData = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const handleSignUp = async () => {
  try {
    const res = await signUp(
      formData.name,
      formData.email,
      formData.password,
      formData.password_confirmation
    );
    if (res.status === 200) {
      debugger;
      console.log(res);
      message("新規登録が完了しました", { autoHide: true, hideTime: 3000 });
      router.push({ path: "/" });
    } else {
      const errorMessages = res.data.errors.full_messages.join("\n");
      console.log(errorMessages);
      message(errorMessages, { autoHide: true, hideTime: 3000 });
    }
  } catch (error) {
    console.log(error);
  }
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
  <v-form v-on:submit.prevent="handleSignUp">
    <v-container>
      <h2 class="mb-5">・新規登録</h2>
      <v-row>
        <v-col cols="12" md="20">
          <v-text-field
            type="text"
            placeholder="名前"
            v-model="formData.name"
            required
        /></v-col>
        <v-col cols="12" md="20">
          <v-text-field
            type="email"
            placeholder="メールアドレス"
            v-model="formData.email"
            required
        /></v-col>
        <v-col cols="12" md="20">
          <v-text-field
            type="password"
            placeholder="パスワード"
            v-model="formData.password"
            required
        /></v-col>
        <v-col cols="12" md="20">
          <v-text-field
            type="password"
            placeholder="パスワードをもう一度入力"
            v-model="formData.password_confirmation"
            required
        /></v-col>
        <v-col cols="12" md="4"> <v-btn type="submit">登録</v-btn></v-col>
      </v-row>
    </v-container>
  </v-form>
  <RouterLink
    :to="{
      path: `/login`,
    }"
  >
    ログインページへ
  </RouterLink>
</template>
