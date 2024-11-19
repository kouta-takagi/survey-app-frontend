import { ref, inject } from "vue";
import type { Ref } from "vue";

export const messageKey = Symbol();

type MessageOption = {
  autoHide?: boolean;
  hideTime?: number;
};

const DefaultMessageOption: Required<MessageOption> = {
  autoHide: true,
  hideTime: 2000,
};

type Mutations = {
  message: (value: string, opt?: MessageOption) => void;
  clearMessage: () => void;
};

export type MessageState = {
  isShow: Ref<boolean>;
  messageValue: Ref<string>;
  messageOption: Ref<MessageOption>;
};

export const useMessage = (): Mutations => {
  const provided = inject<Mutations>(messageKey);

  if (provided === undefined) {
    throw Error("message not provided");
  }

  return provided;
};

export const initializeMessage = () => {
  const isShow = ref(false);
  const messageValue = ref("");
  const messageOption = ref(DefaultMessageOption);

  let timer: ReturnType<typeof setTimeout> | undefined;

  const clearMessage = () => {
    isShow.value = false;
    clearTimeout(timer);
    timer = undefined;
  };

  const message = (value: string, opt?: MessageOption) => {
    isShow.value = true;
    messageValue.value = value;
    messageOption.value = { ...DefaultMessageOption, ...opt };

    if (messageOption.value.autoHide) {
      timer = setTimeout(() => {
        clearMessage();
      }, messageOption.value.hideTime);
    }
  };

  return {
    isShow,
    messageValue,
    messageOption,
    message,
    clearMessage,
  };
};
