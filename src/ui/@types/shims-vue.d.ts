/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

declare module 'raw-loader!*'
declare module "@onflow/fcl";
declare module "@onflow/types";