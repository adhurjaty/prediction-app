import type {Config} from '@jest/types';

const { compilerOptions } = require('tsconfig');

const config: Config.InitialOptions = {
  roots: [
    "<rootDir>"
  ],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1"
  },
  moduleFileExtensions: [
      "ts",
      "js",
      "vue",
      "json"
  ],
  testMatch: [
    "**/tests/**/*.+(ts|tsx|js)",
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