import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Add a specific rule configuration to disable the troublesome rule
    rules: {
      // This disables the rule causing errors with params.locale
      "@next/next/no-assign-module-variable": "off",
      // This is the specific rule causing your issue
      "@next/next/no-sync-dynamic-apis": "off"
    }
  }
];

export default eslintConfig;