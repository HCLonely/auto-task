/*
 * @Author       : HCLonely
 * @Date         : 2025-05-30 16:17:59
 * @LastEditTime : 2025-08-18 19:57:26
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/eslint.config.js
 * @Description  :
 */
import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import _import from "eslint-plugin-import";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["dist/**/*", "src/header.js", ".history/**/*", "node_modules/**/*", "**/*.user.js", "*.config.js", "test/**/*", "*.js"]), {
    files: ["src/**/*.ts"],
    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
    )),

    plugins: {
        import: fixupPluginRules(_import),
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
            GM_getValue: "readonly",
            GM_setValue: "readonly",
            Cookies: "readonly",
            Swal: "readonly",
            sha1: "readonly",
            unsafeWindow: true,
            $: true,
        },

        parser: tsParser,
        ecmaVersion: 12,
        sourceType: "module",
    },

    rules: {
        indent: ["error", 2, {
            SwitchCase: 2
        }],
        "linebreak-style": "off",
        quotes: ["error", "single"],
        semi: ["error", "always"],

        "prefer-const": ["error", {
            destructuring: "any",
            ignoreReadBeforeAssign: false,
        }],

        "no-var": "error",
        "no-new-object": "error",
        "object-shorthand": "error",
        "quote-props": ["error", "as-needed"],
        "prefer-object-spread": "error",
        "no-array-constructor": "error",
        "array-callback-return": "error",

        "prefer-destructuring": ["error", {
            array: true,
            object: true,
        }],

        "prefer-template": "error",
        "template-curly-spacing": ["error", "never"],
        "no-eval": "error",
        "func-style": ["error", "expression"],
        "wrap-iife": ["error", "outside"],
        "no-loop-func": "error",
        "prefer-rest-params": "error",
        "default-param-last": "error",
        "no-new-func": "error",

        "space-before-function-paren": ["error", {
            anonymous: "always",
            named: "never",
            asyncArrow: "always",
        }],

        "space-before-blocks": "error",
        "no-param-reassign": "error",
        "prefer-spread": "error",
        "prefer-arrow-callback": "error",
        "arrow-spacing": "error",
        "arrow-parens": "error",
        "arrow-body-style": "error",

        "no-confusing-arrow": ["error", {
            allowParens: true,
        }],

        "implicit-arrow-linebreak": ["error", "beside"],
        "no-useless-constructor": "error",
        "class-methods-use-this": 0,
        "no-duplicate-imports": "error",
        "import/no-mutable-exports": "error",
        "import/prefer-default-export": "off",
        "import/first": "error",
        "import/no-named-as-default-member": "off",

        "object-curly-newline": ["error", {
            ObjectPattern: {
                multiline: true,
            },
        }],

        "import/no-webpack-loader-syntax": "error",
        "import/extensions": 0,
        "import/no-unresolved": 0,
        "no-iterator": "error",
        "generator-star-spacing": ["error", "after"],
        "dot-notation": "error",
        "one-var": ["error", "never"],
        "no-multi-assign": "error",
        "no-plusplus": ["error", {
            allowForLoopAfterthoughts: true
        }],
        "operator-linebreak": ["error", "after"],
        eqeqeq: "error",
        "no-nested-ternary": "off",
        "no-unneeded-ternary": "error",
        "no-mixed-operators": "error",
        "nonblock-statement-body-position": ["error", "beside"],

        "brace-style": ["error", "1tbs", {
            allowSingleLine: true,
        }],

        "no-else-return": "error",
        "spaced-comment": ["error", "always"],
        "keyword-spacing": "error",
        "space-infix-ops": "error",
        "eol-last": ["error", "always"],
        "newline-per-chained-call": "error",
        "no-whitespace-before-property": "error",
        "padded-blocks": ["error", "never"],

        "no-multiple-empty-lines": ["error", {
            max: 1,
        }],

        "space-in-parens": ["error", "never"],
        "array-bracket-spacing": ["error", "never"],
        "object-curly-spacing": ["error", "always"],

        "max-len": "off",

        "block-spacing": "error",

        "comma-spacing": ["error", {
            before: false,
            after: true,
        }],

        "computed-property-spacing": ["error", "never"],
        "func-call-spacing": ["error", "never"],
        "key-spacing": "error",
        "no-trailing-spaces": "error",
        "comma-style": "error",
        "comma-dangle": ["error", "never"],
        "no-new-wrappers": "error",
        radix: "error",
        "id-length": "off",
        "no-constant-binary-expression": "off",

        camelcase: ["error", {
            allow: [
                "GM_info",
                "GM_setValue",
                "GM_getValue",
                "GM_deleteValue",
                "GM_registerMenuCommand",
                "GM_openInTab",
                "GM_listValues",
                "GM_setClipboard",
                "GM_getResourceText",
                "GM_cookie",
                "system_locale",
                "browser_user_agent",
                "browser_version",
                "os_version",
                "referring_domain",
                "referrer_current",
                "referring_domain_current",
                "release_channel",
                "client_build_number",
                "client_event_source",
                "has_client_mods",
                "client_launch_id",
                "client_heartbeat_session_id",
                "client_app_state",
                "location_guild_id",
                "location_channel_id",
                "location_channel_type",
                "sr_name",
                "api_type",
                "include_profile_interstitial_type",
                "include_blocking",
                "include_blocked_by",
                "include_want_retweets",
                "include_mute_edge",
                "include_can_dm",
                "include_can_media_tag",
                "include_followed_by",
                "skip_status",
                "event_subtype",
                "track_code",
                "reaction_id",
                "game_update",
                "playtime_forever"
            ],
        }],

        "new-cap": ["error", {
            capIsNewExceptions: [
                "GM_xmlhttpRequest",
                "GM_addStyle",
                "GM_setValue",
                "GM_getValue",
                "GM_deleteValue",
                "GM_registerMenuCommand",
                "GM_openInTab",
                "GM_listValues",
                "GM_setClipboard",
                "GM_getResourceText",
                "GM_addValueChangeListener",
                "GM_removeValueChangeListener"
            ],
        }],

        "no-underscore-dangle": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
}]);
