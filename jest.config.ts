import { defaults } from "jest-config";
export default {
    moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
    automock: false,
    testEnvironment: "node",
    coverageDirectory: "coverage",
    collectCoverage: true,
    collectCoverageFrom: ["<rootDir>/src/api/controllers/*"],
    clearMocks: true,
    testPathIgnorePatterns: ["<rootDir>/node_modules"],
    roots: ["<rootDir>"],
    testRegex: "(\\.|/)(test|spec)\\.ts?$",
    // testMatch: ["<rootDir>/../tests/jest/**/*.spec.[jt]s?(x)"],
};
