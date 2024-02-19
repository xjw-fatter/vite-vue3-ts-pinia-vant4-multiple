import { $api } from '@/projects/subTemplate/utils';

export default {
  // 获取省份数据
  $test: () => $api.get('xxx/xxx', { needCheck: false, showLoading: true }),
};
