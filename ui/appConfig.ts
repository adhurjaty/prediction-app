const config = {
    apiDomain: process.env.API_DOMAIN || 'http://localhost:5000',
    apiSecret: process.env.NEXTAUTH_SECRET || 'secret',
    flow: {
        accessNode: process.env.FLOW_ACCESS_NODE || 'http://localhost:8888',
        discoveryWallet: process.env.FLOW_DISCOVERY_WALLET || 'http://localhost:8701/fcl/authn',
        delphaiAddress: process.env.FLOW_DELPHAI_ADDRESS || '0xf8d6e0586b0a20c7',
    }
};

export default config;