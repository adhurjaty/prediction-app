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
    "**/tests/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
      "^.+\\.(vue)$": "vue-jest"
  },
}

export default config;