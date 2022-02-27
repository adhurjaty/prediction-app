<template>
    <section v-bind:class="{ 'empty': groups.length === 0 }">
        <div class="no-groups" v-if="groups.length === 0">
            <h2>Get Started by creating a new group and inviting friends</h2>
            <router-link to="/groups/create">
                <button>+ group</button>
            </router-link>
        </div>
        <div class="groups" v-if="groups.length > 0">
            <div v-for="group in groups" :key="group.title">
                <router-link :to="{ name: 'Group', params: {id: group.id } }" class="group">
                    <div :style="`background:${group.color}`" class="circle">
                        <div class="circle-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20"><path d="M10.118 16.064c2.293-.529 4.428-.993 3.394-2.945-3.146-5.942-.834-9.119 2.488-9.119 3.388 0 5.644 3.299 2.488 9.119-1.065 1.964 1.149 2.427 3.394 2.945 1.986.459 2.118 1.43 2.118 3.111l-.003.825h-15.994c0-2.196-.176-3.407 2.115-3.936zm-10.116 3.936h6.001c-.028-6.542 2.995-3.697 2.995-8.901 0-2.009-1.311-3.099-2.998-3.099-2.492 0-4.226 2.383-1.866 6.839.775 1.464-.825 1.812-2.545 2.209-1.49.344-1.589 1.072-1.589 2.333l.002.619z"/></svg>
                        </div>
                    </div>
                    <div class="text-info">
                        <p class="title" :style="`color:${group.color}`">{{ group.name }}</p>
                        <p>{{ group.accuracy }}% accurate</p>
                        <p>{{ group.betsMade }}/{{ group.betsAvailable }} active bets</p>  
                    </div>
                </router-link>
            </div>
            <router-link :to="{ name: 'Create Group'}">
                <button>+ group</button>
            </router-link>
        </div>
    </section>
</template>

<script lang="ts">
import { Store } from '@/app.store';
import { Vue } from 'vue-class-component';
import { GroupsActions } from '../groups.store';
import { Group } from '../models';
import { executePlaceBetFUSD } from '../../contracts/delphaiInterface';

export default class GroupPage extends Vue {
    groups: Group[] = [];

    async created(): Promise<void> {
        const store: Store = this.$store;
        await store.dispatch(GroupsActions.FETCH_GROUPS);
        this.groups = store.getters.getGroups;
    }
}
</script>

<style lang="scss" scoped>
    .no-groups {
        text-align: center;
    }

    .group {
        @include iconWithData;

        .title {
            font-weight: bold;
            color: $purple-title;
        }

        .circle svg {
            width: 40px;
        }
    }

    button {
        @include button;
        margin: 0 auto;
        display: block;
    }
</style>