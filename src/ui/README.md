# ui

## Project setup
```
yarn install
```

If you've changed the contract, copy the generated abi (json file) to the `abi` directory and run:
```
npx typechain --target=ethers-v5 "./abi/*.json"
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
