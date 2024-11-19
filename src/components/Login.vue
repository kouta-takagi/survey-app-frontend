<script setup lang="ts">
import { inject, reactive } from 'vue'
import { login } from '@/api/auth'

const pageType = inject('pageType')

const formData = reactive({
  email: '',
  password: '',
})
const handleLogin = async () => {
  await login(formData.email, formData.password).then(res => {
    if (res.status === 200) {
      console.log(res)
      pageType.value = 'surveys'
    } else {
      alert('メールアドレスかパスワードが間違っています')
    }
  })
}
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
</template>
