<script lang="ts">
import { defineComponent, inject } from "vue";
import { messageKey } from "@/composables/useMessage";
import type { MessageState } from "@/composables/useMessage";

export default defineComponent({
  setup() {
    const provided = inject<MessageState>(messageKey);
    if (provided === undefined) {
      throw Error("Message Not Provided");
    }
    const { messageValue, isShow } = provided;
    return { messageValue, isShow };
  },
});
</script>

<template>
  <teleport to="#flash-message">
    <transition name="fade">
      <div v-if="isShow" class="flash-message" role="alert">
        <div class="message">{{ messageValue }}</div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.flash-message {
  position: fixed;
  bottom: 20px;
  right: 0;
  left: 0;
  margin: auto;

  width: 768px;
  display: flex;
  justify-content: center;
}

.message {
  min-width: 200px;
  height: 20px;
  padding: 10px 20px;

  color: #f5f5f5;
  font-size: 16px;
  text-align: center;
  border-radius: 4px;
  background-color: #555555;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
