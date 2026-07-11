// ==UserScript==
// @name         FR Tools
// @author       Nick Filipovic (DFU)
// @namespace    FRTOOLS
// @version      4.0.5
// @description  Modular Tampermonkey toolkit for the Forensic Register
// @match        https://vicpol.forensic-register.app/*
// @downloadURL  https://github.com/tricky-au/FRTools/releases/latest/download/FRTools.user.js
// @updateURL    https://github.com/tricky-au/FRTools/releases/latest/download/FRTools.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// ==/UserScript==


// ======================================
// core.js
// ======================================

(function () {
    'use strict';

    const FRTools = {

        Version: "__VERSION__",

        Module: {},

        Storage: {},

        Settings: {},

        Events: {},

        GUI: {},

        Utils: {},

        state: {
            uiOpen: false,
            uiInitialized: false
        }

    };

    window.FRTools = FRTools;

    const Storage = {
        get(key, fallback) {
            const val = GM_getValue(key);
            return val === undefined ? fallback : val;
        },
        set(key, value) {
            GM_setValue(key, value);
        }
    };

    FRTools.Storage = Storage;

    GM_addStyle(`
        #frtools-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            background: #1e88e5;
            color: white;
            border: none;
            border-radius: 50px;
            padding: 10px 14px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 3px 10px rgba(0,0,0,0.25);
        }

        #frtools-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 520px;
            max-height: 70vh;
            overflow: auto;
            background: white;
            z-index: 1000000;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            display: none;
            padding: 16px;
        }

        #frtools-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            z-index: 999999;
            display: none;
        }

        .frtools-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .frtools-section {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
        }
    `);

    function createUI() {
        if (FRTools.state.uiInitialized) {
            return;
        }

        if (document.getElementById('frtools-button')) {
            FRTools.state.uiInitialized = true;
            return;
        }

        const btn = document.createElement('button');
        btn.id = 'frtools-button';
        btn.textContent = 'FR Tools';

        const overlay = document.createElement('div');
        overlay.id = 'frtools-overlay';

        const modal = document.createElement('div');
        modal.id = 'frtools-modal';

        modal.innerHTML = `
            <div class="frtools-title">FR Tools</div>

            <div class="frtools-section">
                Core loaded<br>
                Modules: 0
            </div>
        `;

        function open() {
            overlay.style.display = 'block';
            modal.style.display = 'block';
            FRTools.state.uiOpen = true;
        }

        function close() {
            overlay.style.display = 'none';
            modal.style.display = 'none';
            FRTools.state.uiOpen = false;
        }

        btn.addEventListener('click', () => {
            FRTools.state.uiOpen ? close() : open();
        });

        overlay.addEventListener('click', close);

        document.body.appendChild(btn);
        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        FRTools.state.uiInitialized = true;
    }

    function initialize() {
        createUI();
        console.log("[FR Tools] Core loaded");
    }

    function waitForBody() {
        if (document.body) {
            initialize();
        } else {
            const obs = new MutationObserver(() => {
                if (document.body) {
                    obs.disconnect();
                    initialize();
                }
            });
            obs.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    FRTools.init = function () {
        waitForBody();
    };

})();



// ======================================
// gui.js
// ======================================




// ======================================
// registry.js
// ======================================

(function () {
    "use strict";

    const modules = {};

    const FRTools = window.FRTools;

    if (!FRTools) {
        console.error("[FR Tools] Core not loaded.");
        return;
    }


    FRTools.Module = {

        register(module) {

            if (!module || typeof module !== "object") {
                console.error("[FR Tools] Invalid module.");
                return false;
            }


            if (!module.id) {
                console.error("[FR Tools] Module missing id.");
                return false;
            }


            if (modules[module.id]) {
                console.error(
                    `[FR Tools] Module "${module.id}" already registered.`
                );

                return false;
            }


            modules[module.id] = module;

            console.log(
                `[FR Tools] Registered module: ${module.id}`
            );

            return true;
        },


        get(id) {
            return modules[id];
        },


        all() {
            return Object.values(modules);
        },

        initAll() {

        Object.values(modules).forEach(module => {

        if (
            typeof module.init === "function" &&
            module.enabledByDefault !== false
        ) {

            console.log(
                `[FR Tools] Starting module: ${module.id}`
            );

            module.init();

        }

    });

}

    };

})();


// ======================================
// settings.js
// ======================================




// ======================================
// shortcuts.js
// ======================================




// ======================================
// timestamp.js
// ======================================




// ======================================
// modules/autoexpand.js
// ======================================

FRTools.Module.register({

    id: "autoexpand",

    name: "Auto Expand",

    version: "1.0.0",

    enabledByDefault: true,

    init() {

        console.log("[FR Tools] Auto Expand loaded");

    }

});


// ======================================
// main.js
// ======================================

(function () {
    "use strict";

    console.log("[FR Tools] Starting...");

    console.log(
        "[FR Tools] Registered Modules:",
        FRTools.Module.all()
    );

    FRTools.Module.initAll();

    FRTools.init();

})();

