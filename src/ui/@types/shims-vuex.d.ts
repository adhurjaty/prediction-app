import { ComponentCustomProperties } from 'vue'
import { State } from '@/groups/group.store';
import { Store } from '@/store';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: Store<State>;
    }
}
