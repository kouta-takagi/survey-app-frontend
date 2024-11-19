<script setup lang="ts">
import { watchEffect, reactive, ref, provide } from 'vue'
import type { Answer } from '../types/answer'
import axios from 'axios'
import OneAnswer from './OneAnswer.vue'

interface Props {
  question_id: number
  survey_id: number
}

interface ErrorData {
  response: Response
}

interface Response {
  data: []
}

const props = defineProps<Props>()

const answerState = ref('')

const validations = ref<string[]>([])

const answersBeforeReactive = new Map<number, Answer>()
const answers = reactive(answersBeforeReactive)

watchEffect((): void => {
  const fetchAnswers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/surveys/${props.survey_id}/questions/${props.question_id}/answers`,
        {
          headers: {
            'access-token': localStorage.getItem('access-token'),
            client: localStorage.getItem('client'),
            uid: localStorage.getItem('uid'),
          },
        },
      )
      response.data.forEach(obj => {
        answers.set(obj.id, {
          id: obj.id,
          response: obj.response,
          question_id: obj.question_id,
        })
      })
      console.log('success')
    } catch (error) {
      console.log(error)
    }
  }

  fetchAnswers()
})

// function handleCreate(): void {
//   const createAnswer = async () => {
//     try {
//       const response = await axios.post(
//         `http://localhost:3000/surveys/${props.survey_id}/questions/${props.question_id}/answers`,
//         {
//           response: answerState.value,
//         },
//         {
//           headers: {
//             'access-token': localStorage.getItem('access-token'),
//             client: localStorage.getItem('client'),
//             uid: localStorage.getItem('uid'),
//           },
//         },
//       )
//       const res = response.data
//       answers.set(res.id, {
//         id: res.id,
//         response: res.response,
//         question_id: res.question_id,
//       })
//       answerState.value = ''
//     } catch (error) {
//       if (typeof error !== 'object' || error === null) {
//         return false
//       }

//       const errorData = error as Record<keyof ErrorData, unknown>
//       if (typeof errorData.response !== 'object') {
//         return false
//       }

//       const response = errorData.response as Record<keyof Response, unknown>
//       if (!Array.isArray(response.data)) {
//         return false
//       }

//       if (typeof response.data === 'string') {
//         return false
//       }

//       validations.value = response.data
//     }
//   }

//   createAnswer()
// }

provide('answers', answers)
</script>

<template>
  <h2>・回答一覧</h2>

  <div class="my-2">
    <OneAnswer
      v-for="answer in answers.values()"
      v-bind:key="answer.id"
      v-bind:id="answer.id"
      v-bind:response="answer.response"
      v-bind:question_id="answer.question_id"
    />
  </div>
  <!--
  <form v-on:submit.prevent="handleCreate">
    <h3 class="my-2">・新規回答作成</h3>
    <div v-for="validation in validations" :key="validation">
      <p class="text-red-lighten-1">{{ validation }}</p>
    </div>
    <v-text-field type="text" placeholder="内容" v-model="answerState" />
    <v-btn type="submit">作成</v-btn>
  </form> -->
</template>
