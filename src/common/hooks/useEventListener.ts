export const useEventListener = (target: any, event: any, callback: any, useCapture = false, keepAlive = false) => {
  if (keepAlive) {
    onActivated(() => target.addEventListener(event, callback, useCapture));
    onDeactivated(() => target.removeEventListener(event, callback, useCapture));
  } else {
    onMounted(() => target.addEventListener(event, callback, useCapture));
    onUnmounted(() => target.removeEventListener(event, callback, useCapture));
  }
};
