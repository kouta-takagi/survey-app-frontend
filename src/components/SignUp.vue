<script setup lang="ts">
import { inject, reactive } from 'vue'
import { signUp } from '@/api/auth'

const formData = reactive({
  email: '',
  password: '',
  password_confirmation: '',
})

const handleSignUp = async () => {
  try {
    const res = await signUp(formData.email, formData.password)
    if (res.status === 200) {
      console.log(res)
      pageType.value = 'surveys'
    }
  } catch (error) {
    console.log(error)
  }
}

const pageType = inject('pageType')
</script>

<template>
  <v-form v-on:submit.prevent="handleSignUp">
    <v-container>
      <h2 class="mb-5">・新規登録</h2>
      <v-row>
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
        <!-- <v-col cols="12" md="20">
          <v-text-field
            type="password"
            placeholder="パスワードをもう一度入力"
            v-model="formData.password_confirmation"
            required
        /></v-col> -->
        <v-col cols="12" md="4"> <v-btn type="submit">登録</v-btn></v-col>
      </v-row>
    </v-container>
  </v-form>
  <!-- <button v-on:click="handleLogout">ko</button> -->
</template>
