const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = {
    ...withPWA({
        pwa: {
            dest: 'public',
            runtimeCaching,
        },
    }),
    env: {
        FLOW_ACCESS_NODE: process.env.FLOW_ACCESS_NODE,
        FLOW_DISCOVERY_WALLET: process.env.FLOW_DISCOVERY_WALLET,
        FLOW_DELPHAI_ADDRESS: process.env.FLOW_DELPHAI_ADDRESS,
        FLOW_FUSD_ADDRESS: process.env.FLOW_FUSD_ADDRESS,
        FLOW_FUNGIBLE_TOKEN: process.env.FLOW_FUNGIBLE_TOKEN,
        FLOW_TOKEN_ADDRESS: process.env.FLOW_TOKEN_ADDRESS,
    }
}
