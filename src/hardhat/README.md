# Build the Hardhat server

```
docker build -f Dockerfile.server -t bwf/hardhat-server:latest .
```

# Build the client (client doesn't work yet)

```
docker build -f Dockerfile.client -t bwf/hardhat-client:latest .
```

# Run the Hardhat server

`docker run -p 8545:8545/tcp -it bwf/hardhat-server:latest`