import { Ref } from 'vue';
import { showFailToast, showSuccessToast } from 'vant';
import Clipboard from 'clipboard';

export const useClipboard = () => {
  const copy = (text: string | Ref<string>, container?: HTMLElement) => {
    const value = unref(text);
    const fakeEl = document.createElement('button');
    const clipboard = new Clipboard(fakeEl, {
      text: () => value,
      action: () => 'copy',
      container: container !== undefined ? container : document.body,
    });
    clipboard.on('success', () => {
      showSuccessToast('复制成功');
      clipboard.destroy();
    });
    clipboard.on('error', () => {
      showFailToast('复制失败');
      clipboard.destroy();
    });
    document.body.appendChild(fakeEl);
    fakeEl.click();
    document.body.removeChild(fakeEl);
  };
  return { copy };
};
