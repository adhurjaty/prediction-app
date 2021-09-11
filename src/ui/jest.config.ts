module.exports = {
    roots: [
      "<rootDir>/src"
    ],
    moduleFileExtensions: [
        "ts",
        "js",
        "vue",
        "json"
    ],
    testMatch: [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
        "^.+\\.(vue)$": "vue-jest"
    },
  }