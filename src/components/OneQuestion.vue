<script setup lang="ts">
import { inject, ref } from 'vue'
import type { Question } from '../types/question'
import Answers from './Answers.vue'

interface Props {
  id: number
  content: string
  survey_id: number
}

const props = defineProps<Props>()

const isOpen = ref(false)

const questions = inject('questions') as Map<number, Question>

const question = questions.get(props.id) as Question

function handleToggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="d-flex justify-space-between my-2">
    <div>{{ question.content }}</div>
    <v-btn v-on:click="handleToggle">
      回答一覧を{{ isOpen ? '非表示' : '表示' }}
    </v-btn>
  </div>
  <Answers
    v-if="isOpen"
    v-bind:question_id="question.id"
    v-bind:survey_id="question.survey_id"
  />
</template>
