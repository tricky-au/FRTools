// ==UserScript==
// @name         FR Tools
// @author       Nick Filipovic (DFU)
// @namespace    FRTOOLS
// @version      4.0.9
// @description  Modular Tampermonkey toolkit for the Forensic Register
// @match        https://vicpol.forensic-register.app/*
// @downloadURL  https://github.com/tricky-au/FRTools/releases/latest/download/FRTools.user.js
// @updateURL    https://github.com/tricky-au/FRTools/releases/latest/download/FRTools.meta.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
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

    if (typeof unsafeWindow !== "undefined") {

        unsafeWindow.FRTools = FRTools;

    }


    //
    // Storage
    //

    FRTools.Storage = {

        get(key, fallback) {

            const val = GM_getValue(key);

            return val === undefined
                ? fallback
                : val;

        },


        set(key, value) {

            GM_setValue(
                key,
                value
            );

        }

    };


    //
    // Startup
    //

    function start() {

        console.log("[FR Tools] Starting");


        //
        // Start Modules
        //

        if (
            FRTools.Module &&
            typeof FRTools.Module.initAll === "function"
        ) {

            FRTools.Module.initAll();

        }


        //
        // Start GUI
        //

        if (
            FRTools.GUI &&
            typeof FRTools.GUI.init === "function"
        ) {

            FRTools.GUI.init();

        }


        console.log("[FR Tools] Core loaded");

    }


    function waitForBody() {

        if (document.body) {

            start();

        }
        else {

            const obs = new MutationObserver(() => {

                if (document.body) {

                    obs.disconnect();

                    start();

                }

            });


            obs.observe(
                document.documentElement,
                {
                    childList: true,
                    subtree: true
                }
            );

        }

    }


    FRTools.init = function () {

        waitForBody();

    };


})();


// ======================================
// gui.js
// ======================================

FRTools.GUI = {

    init() {

        if (FRTools.state.uiInitialized) {
            return;
        }

        this.addStyles();

        this.createUI();

        FRTools.state.uiInitialized = true;

    },


    addStyles() {

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


            .frtools-module {

                display: flex;

                align-items: center;

                gap: 8px;

                margin: 8px 0;

            }


        `);

    },


    createUI() {


        const btn = document.createElement("button");

        btn.id = "frtools-button";

        btn.textContent = "FR Tools";


        const overlay = document.createElement("div");

        overlay.id = "frtools-overlay";


        const modal = document.createElement("div");

        modal.id = "frtools-modal";


        function renderModules() {

            const modules = FRTools.Module.all();


            return modules.map(module => {

                const enabled =
                    FRTools.Settings.getModuleState(
                        module.id,
                        module.enabledByDefault !== false
                    );


                return `

                    <div class="frtools-module">

                        <input
                            type="checkbox"
                            data-module="${module.id}"
                            ${enabled ? "checked" : ""}
                        >

                        <label>

                            <strong>
                                ${module.name}
                            </strong>

                            <br>

                            <small>
                                ${module.description || ""}
                                <br>
                                Version: ${module.version || "1.0.0"}
                            </small>

                        </label>

                    </div>

                `;

            }).join("");

        }


        modal.innerHTML = `

            <div class="frtools-title">
                FR Tools
            </div>


            <div class="frtools-section">

                <strong>
                    Modules
                </strong>


                <div id="frtools-modules">

                    ${renderModules()}

                </div>


            </div>

        `;


        function open() {

            overlay.style.display = "block";

            modal.style.display = "block";

            FRTools.state.uiOpen = true;

        }


        function close() {

            overlay.style.display = "none";

            modal.style.display = "none";

            FRTools.state.uiOpen = false;

        }


        btn.addEventListener(
            "click",
            () => {

                FRTools.state.uiOpen
                    ? close()
                    : open();

            }
        );


        overlay.addEventListener(
            "click",
            close
        );


        modal.addEventListener(
            "change",
            event => {


                if (
                    event.target.matches(
                        "input[data-module]"
                    )
                ) {


                    const id =
                        event.target.dataset.module;


                    FRTools.Settings.setModuleState(
                        id,
                        event.target.checked
                    );


                    console.log(
                        `[FR Tools] ${id} ${
                            event.target.checked
                                ? "enabled"
                                : "disabled"
                        }`
                    );

                }

            }
        );


        document.body.appendChild(btn);

        document.body.appendChild(overlay);

        document.body.appendChild(modal);


    }

};


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

                const enabled =
                    FRTools.Settings.getModuleState(
                        module.id,
                        module.enabledByDefault !== false
                    );


                if (
                    enabled &&
                    typeof module.init === "function"
                ) {

                    console.log(
                        `[FR Tools] Starting module: ${module.id}`
                    );

                    module.init();

                }
                else {

                    console.log(
                        `[FR Tools] Disabled module: ${module.id}`
                    );

                }

            });

        }

    };

})();


// ======================================
// settings.js
// ======================================

FRTools.Settings = {

    getModuleState(id, defaultValue = true) {

        const key = `module_${id}_enabled`;

        return FRTools.Storage.get(
            key,
            defaultValue
        );

    },


    setModuleState(id, enabled) {

        const key = `module_${id}_enabled`;

        FRTools.Storage.set(
            key,
            enabled
        );

    }

};


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

    description: "Automatically expands hidden table rows.",

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

