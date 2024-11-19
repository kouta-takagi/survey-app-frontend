<script setup lang="ts">
import { inject } from 'vue'
import type { Answer } from '../types/answer'

interface Props {
  id: number
  response: string
  question_id: number
}

const props = defineProps<Props>()

const answers = inject('answers') as Map<number, Answer>

const answer = answers.get(props.id) as Answer
</script>

<template>
  <div class="mb-2">{{ answer.response }}</div>
</template>
