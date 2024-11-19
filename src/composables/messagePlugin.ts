import { initializeMessage, messageKey } from "./useMessage";
import type { Plugin } from "vue";
import FlashMessage from "@/components/FlashMessage.vue";

export const messagePlugin: Plugin = {
  install(app) {
    app.provide(messageKey, initializeMessage());
    app.component("FlashMessage", FlashMessage);
  },
};
