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

### SASS usage
See [SASS Documentation](https://sass-lang.com/documentation).
Can be used directly inside Vue style tags
```
<style lang="scss">
$color: red;

.example {
    padding: 15px;

    .child {
        color: $color;
    }
}
</style>
```
Global variables and mixins are defined by files in ./src/styles. They are included and available for reference within the style tag of any Vue file.
```
// variables.scss
$breakpoints: (
    mobile: 0px,
    tablet: 699px,
    desktop: 1110px
);

// mixins.scss
@mixin respondTo($breakpoint) { 
    @if map-has-key($breakpoints, $breakpoint) {
        @media (min-width: #{map-get($breakpoints, $breakpoint)}) {
            @content;
        }
    }
    
    @else {
        @warn "Breakpoint does not exist for `#{$breakpoint}`. "
            + "check `$breakpoints` map in variables.scss.";
    }
}

// myVueFile.vue
...
<style lang="scss">
$color: red;

.example {
    @include respondTo(mobile) {
        color: red;
    }
}
</style>
```