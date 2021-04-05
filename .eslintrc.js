module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    rules: {
        "@typescript-eslint/no-unused-vars": 0,
        "@typescript-eslint/camelcase": 0,
        "@typescript-eslint/interface-name-prefix": 0,
        "@typescript-eslint/array-type": 2,
        "@typescript-eslint/explicit-function-return-type": 1,
        "@typescript-eslint/no-empty-function": 1,
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    },
};
