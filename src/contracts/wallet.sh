docker run -it \
    -p 8701:8701 \
    -e PORT=8701 \
    -e BASE_URL=http://localhost:8701 \
    -e FLOW_ACCESS_NODE=http://emulator:8888 \
    -e FLOW_ACCOUNT_KEY_ID=0 \
    -e FLOW_ACCOUNT_PRIVATE_KEY=b094368e7a871f8697bb9283d439020d3a303a6610daa59cdee960e5427ae3c7 \
    -e FLOW_ACCOUNT_PUBLIC_KEY=732c620474f12d1ba8507fa9ab6e6b8ce40ea661583e182e54ed09cec04650e90ea395994918e4e33f53cb3b54e2631d35a9638a216027e40fd45769a005945c \
    -e FLOW_INIT_ACCOUNTS=0 \
    -e FLOW_ACCOUNT_ADDRESS=0xf3fcd2c1a78f5eee \
    -e FLOW_AVATAR_URL=https://avatars.onflow.org/avatar/ \
    -e CONTRACT_FUNGIBLE_TOKEN=0xee82856bf20e2aa6 \
    -e CONTRACT_FLOW_TOKEN=0x0ae53cb6e3f42a79 \
    -e CONTRACT_FUSD=0xf8d6e0586b0a20c7 \
    -e CONTRACT_FCL_CRYPTO=0x74daa6f9c7ef24b1 \
    -e TOKEN_AMOUNT_FLOW=100.0 \
    -e TOKEN_AMOUNT_FUSD=100.0 \
    ghcr.io/onflow/fcl-dev-wallet:latest