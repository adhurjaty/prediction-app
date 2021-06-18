<template>
    <div class="friend" @click="toggleActive()" :class="{ active : isActive }">
        <div class="circle">
            <div class="circle-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z"></path></svg>
                <div class="selected"></div>
            </div>
        </div>
        <p>{{ name }}</p>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    id: Number,
    name: String
  }
})

export default class Friend extends Vue {
    isActive: boolean = false;
    toggleActive(): void {
        this.isActive = !this.isActive;
        this.$emit('updateState', this.isActive);
    }
}
</script>

<style lang="scss">
.friend {
    .circle {
        background: #4fde6e;
        width: 50px;
        height: 50px;
        border-radius: 99px;
        overflow: hidden;
        display: grid;
        place-content: center;
        font-size: 32px;
        margin-right: 10px;

        .circle-inner {
            position: relative;
        }

        svg {
            fill: #3ab154;
            height: 57px;
            width: auto;
            transition: height .5s;
        }

        .selected {
            width: 50px;
            height: 50px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            &:before {
                content: '';
                width: 11px;
                height: 23px;
                position: absolute;
                left: 18px;
                top: 8px;
                opacity: 0;
                transform: rotate(45deg);
                border-right: 6px solid white;
                border-bottom: 6px solid white;
                transition: opacity .5s;
            }
        }
    }

    &.active {
        svg {
            height: 160px;
        }

        .selected:before {
            opacity: 1;
        }
    }
}
</style>