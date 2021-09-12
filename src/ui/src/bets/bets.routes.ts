import { RouteRecordRaw } from "vue-router";

export default (): RouteRecordRaw[] => {
    return [
        {
            path: '/groups/:id/bets/add-bet',
            name: 'Add Bet',
            component: import('./views/AddBet.vue')
        }
    ]
}