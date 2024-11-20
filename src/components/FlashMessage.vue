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
  top: 20px; /* 上部に配置 */
  right: 0;
  left: 0;
  margin: auto;

  width: 90%; /* 横幅を広げる */
  max-width: 1024px; /* 最大幅を設定 */
  display: flex;
  justify-content: center;
  z-index: 1000; /* 他の要素より前面に表示 */
}

.message {
  min-width: 300px; /* 幅を広げる */
  height: 50px; /* 高さを調整 */
  padding: 10px 30px; /* 内側の余白を増やす */

  color: #ffffff;
  font-size: 20px; /* 文字サイズを大きくする */
  text-align: center;
  border-radius: 8px; /* ボーダーの角を丸くする */
  background-color: #333333; /* 背景色を少し濃く */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 影を追加 */
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
