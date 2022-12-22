const fs = require("fs");
const path = require("path");

const src = fs.readdirSync(path.resolve(__dirname, "./src"));
const scopes = ["public", "scripts", "typings", ...src];

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", scopes],
    "body-leading-blank": [1, "always"],
    "footer-leading-blank": [1, "always"],
    "header-max-length": [2, "always", 72],
    "scope-case": [2, "always", "lower-case"],
    "subject-case": [1, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
  },
  prompt: {
    useEmoji: true,
    scopes: [...scopes],
    enableMultipleScopes: true,
    scopeEnumSeparator: ",",
  },
};
