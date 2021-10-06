/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}
