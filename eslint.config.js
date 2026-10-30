import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default [
    { ignores: ["dist/**", "node_modules/**"] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,ts}"],
        plugins: {
            "@stylistic": stylistic,
            "unused-imports": unusedImports,
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": ["warn", {
                vars: "all",
                varsIgnorePattern: "^_",
                args: "all",
                argsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            }],
            "@stylistic/indent": ["error", 4, { SwitchCase: 1 }],
            "@stylistic/no-tabs": "error",
            "@stylistic/no-trailing-spaces": "error",
            "@stylistic/eol-last": ["error", "always"],
        },
    },
    {
        files: ["**/*.ts"],
        rules: {
            "@typescript-eslint/consistent-type-imports": ["error", {
                prefer: "type-imports",
            }],
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
];
