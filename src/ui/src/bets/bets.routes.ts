import { RouteRecordRaw } from "vue-router";

export default (): RouteRecordRaw[] => {
    return [
        {
            path: '/groups/:id/bets',
            name: 'List Group Bets',
            component: import('./views/BetsList.vue')
        },
        {
            path: '/bets/add-bet',
            name: 'Add Bet',
            component: import('./views/AddBet.vue')
        },
        {
            path: '/bets',
            name: 'List User Bets',
            component: import('./views/BetsList.vue')
        },
        {
            path: 'groups/:id/bets/:betId',
            name: 'Bet',
            component: import('./views/Bet.vue')
        },

    ]
}