module.exports = [

    
    // ==========================
    // Node.js scripts
    // ==========================

    {
        files: ["build/**/*.js"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",

            globals: {
                console: "readonly",
                process: "readonly",
                __dirname: "readonly",
                FRTools: "readonly"
            }
        },

        rules: {
            "no-unused-vars": "warn",
            "no-redeclare": "error",
            "no-undef": "error",
            "eqeqeq": "error"
        }
    },

    // ==========================
    // Tampermonkey source
    // ==========================

    {
        files: ["src/**/*.js"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script",

            globals: {
                console: "readonly",

                window: "readonly",
                document: "readonly",
                navigator: "readonly",
                location: "readonly",

                MutationObserver: "readonly",

                setTimeout: "readonly",
                clearTimeout: "readonly",

                GM_getValue: "readonly",
                GM_setValue: "readonly",
                GM_addStyle: "readonly",

                FRTools: "readonly",
                unsafeWindow: "readonly",

                Blob: "readonly",
                URL: "readonly",
                FileReader: "readonly",
                confirm: "readonly",
                GM_info: "readonly",
                GM_addStyle: "readonly",
                URLSearchParams: "readonly",
                jQuery: "readonly",
                html2pdf: "readonly",
            }
        },

        rules: {
            "no-unused-vars": "warn",
            "no-redeclare": "error",
            "no-undef": "error",
            "no-unreachable": "warn",
            "no-constant-condition": "warn",
            "eqeqeq": "error"
        }
    }

];