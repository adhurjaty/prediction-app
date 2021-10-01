import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  roots: [
    "<rootDir>"
  ],
  moduleFileExtensions: [
      "ts",
      "js",
      "vue",
      "json"
  ],
  testMatch: [
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
        "^.+\\.(vue)$": "vue-jest"
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^~/(.*)$": "<rootDir>/src/$1"
    },
    testEnvironment: "node"
}

export default config;