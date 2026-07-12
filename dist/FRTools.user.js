// ==UserScript==
// @name         FR Tools
// @author       Nick Filipovic (DFU)
// @namespace    FRTOOLS
// @version      4.0.12
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

        GUI: {
            notifications: []
        },

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

        notify(message) {

        let notification = document.getElementById(
            "frtools-notification"
        );


        if (!notification) {

            notification = document.createElement("div");

            notification.id = "frtools-notification";

            document.body.appendChild(notification);

        }


        notification.textContent = message;

        notification.classList.add("show");


        setTimeout(() => {

            notification.classList.remove("show");

        }, 4500);

    },

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

                #frtools-notification {

                position: fixed;

                bottom: 80px;

                right: 20px;

                z-index: 1000001;

                background: #333;

                color: white;

                padding: 12px 16px;

                border-radius: 6px;

                font-size: 13px;

                box-shadow: 0 4px 12px rgba(0,0,0,0.3);

                opacity: 0;

                transition: opacity 0.3s ease;

            }


            #frtools-notification.show {

                opacity: 1;

            }

            .frtools-module-option {

                margin-left: 28px;

                margin-top: 6px;

                margin-bottom: 10px;

                font-size: 13px;

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

    // -------------------------
    // Title
    // -------------------------

    const title = document.createElement("div");
    title.className = "frtools-title";
    title.textContent = "FR Tools";

    modal.appendChild(title);

    // -------------------------
    // Modules
    // -------------------------

    const moduleSection = document.createElement("div");
    moduleSection.className = "frtools-section";

    const moduleHeading = document.createElement("strong");
    moduleHeading.textContent = "Modules";

    moduleSection.appendChild(moduleHeading);

    const moduleContainer = document.createElement("div");
    moduleContainer.id = "frtools-modules";

    FRTools.Module.all().forEach(module => {

        const enabled = FRTools.Settings.getModuleState(
            module.id,
            module.enabledByDefault !== false
        );

        const row = document.createElement("div");
        row.className = "frtools-module";

        row.innerHTML = `
            <input
                type="checkbox"
                data-module="${module.id}"
                ${enabled ? "checked" : ""}
            >

            <label>
                <strong>${module.name}</strong><br>

                <small>
                    ${module.description || ""}
                    <br>
                    Version: ${module.version || "1.0.0"}
                    <br>
                    Author: ${module.author || "Unknown"}
                </small>
            </label>
        `;

        moduleContainer.appendChild(row);

        if (
            typeof module.settingsUI === "function"
        ) {

            const option = document.createElement(
                "div"
            );


            option.className =
                "frtools-module-option";


            option.innerHTML =
                module.settingsUI();


            moduleContainer.appendChild(
                option
            );


            if (
                module.id === "exhibitsort"
            ) {

                const select =
                    option.querySelector(
                        "#exhibitsort-direction"
                    );


                if (select) {

                    select.value =
                        FRTools.Storage.get(
                            "exhibitsort_direction",
                            "asc"
                        );


                    select.addEventListener(
                        "change",
                        () => {

                            FRTools.Storage.set(
                                "exhibitsort_direction",
                                select.value
                            );


                            FRTools.GUI.notify(
                                `${module.name}: ${
                                    select.value === "asc"
                                        ? "Ascending"
                                        : "Descending"
                                }`
                            );

                        }
                    );

                }

            }

        }

    });

    moduleSection.appendChild(moduleContainer);

    modal.appendChild(moduleSection);

    // -------------------------
    // Settings
    // -------------------------

    const settingsSection = document.createElement("div");
    settingsSection.className = "frtools-section";

    settingsSection.innerHTML = `
        <strong>Settings</strong>
        <br><br>

        <button id="frtools-export-settings">
            Export Settings
        </button>

        <br><br>

        <button id="frtools-import-settings">
            Import Settings
        </button>

        <br><br>

        <button id="frtools-reset-settings">
            Reset Settings
        </button>
    `;

    modal.appendChild(settingsSection);

    settingsSection
        .querySelector("#frtools-export-settings")
        .addEventListener("click", () => {

            const json = FRTools.Settings.exportSettings();

            const blob = new Blob(
                [json],
                {
                    type: "application/json"
                }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "FRTools-Settings.json";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(url);

            FRTools.GUI.notify(
                "Settings exported"
            );

        });

        const importInput = document.createElement("input");

        importInput.type = "file";
        importInput.accept = "application/json";
        importInput.style.display = "none";

        document.body.appendChild(importInput);


        settingsSection
            .querySelector("#frtools-import-settings")
            .addEventListener("click", () => {

                importInput.click();

            });


        importInput.addEventListener("change", event => {

            const file = event.target.files[0];

            if (!file) {
                return;
            }


            const reader = new FileReader();


            reader.onload = () => {

                try {

                        FRTools.Settings.importSettings(
                            reader.result
                        );

                        refreshModules();

                        FRTools.GUI.notify(
                            "Settings imported"
                        );

                }
                catch(error) {

                    console.error(
                        "[FR Tools] Import failed",
                        error
                    );

                }

            };


            reader.readAsText(file);

        });

        settingsSection
            .querySelector("#frtools-reset-settings")
            .addEventListener("click", () => {

                const confirmed = confirm(
                    "Reset FR Tools settings?\n\nThis will restore all modules to their default state."
                );


                if (!confirmed) {
                    return;
                }


                FRTools.Settings.resetSettings();

                refreshModules();


                FRTools.GUI.notify(
                    "Settings reset"
                );

            });

        function refreshModules() {

        const container = modal.querySelector(
            "#frtools-modules"
        );

        if (!container) {
            return;
        }


        container.innerHTML = "";


        FRTools.Module.all().forEach(module => {

            const enabled =
                FRTools.Settings.getModuleState(
                    module.id,
                    module.enabledByDefault !== false
                );


            const row = document.createElement("div");

            row.className = "frtools-module";


            row.innerHTML = `

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
                    <br>
                    Author: ${module.author || "Unknown"}
                </small>

                </label>

            `;


            container.appendChild(row);

        });

    }

    // -------------------------
    // Open / Close
    // -------------------------

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

    btn.addEventListener("click", () => {

        FRTools.state.uiOpen
            ? close()
            : open();

    });

    overlay.addEventListener("click", close);

    // -------------------------
    // Module toggle
    // -------------------------

    modal.addEventListener("change", event => {

        if (!event.target.matches("input[data-module]")) {
            return;
        }


        const moduleId = event.target.dataset.module;

        const module = FRTools.Module.all()
            .find(m => m.id === moduleId);

        const moduleName = module
            ? module.name
            : moduleId;

        const enabled = event.target.checked;


        if (enabled) {

            FRTools.Module.enable(
                moduleId
            );

        }
        else {

            FRTools.Module.disable(
                moduleId
            );

        }


    });

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
                        `[FR Tools] Starting module: ${module.name}`
                    );


                    module.init();

                }
                else {

                    console.log(
                        `[FR Tools] Disabled module: ${module.name}`
                    );

                }

            });

        },


        enable(id) {

            const module = this.get(id);


            if (!module) {

                console.error(
                    `[FR Tools] Module not found: ${id}`
                );

                return;

            }


            FRTools.Settings.setModuleState(
                id,
                true
            );


            if (
                typeof module.init === "function"
            ) {

                console.log(
                    `[FR Tools] Starting module: ${module.name}`
                );


                module.init();

            }


            FRTools.GUI.notify(
                `${module.name} enabled`
            );

        },


        disable(id) {

            const module = this.get(id);


            if (!module) {

                console.error(
                    `[FR Tools] Module not found: ${id}`
                );

                return;

            }


            FRTools.Settings.setModuleState(
                id,
                false
            );


            if (
                typeof module.destroy === "function"
            ) {

                console.log(
                    `[FR Tools] Stopping module: ${module.name}`
                );


                module.destroy();

            }


            FRTools.GUI.notify(
                `${module.name} disabled`
            );

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

    },

    exportSettings() {

    const settings = {

        version: 1,

        modules: {}

    };


    FRTools.Module.all().forEach(module => {

        settings.modules[module.id] =
            this.getModuleState(
                module.id,
                module.enabledByDefault !== false
            );

    });


    return JSON.stringify(
        settings,
        null,
        2
    );

},


importSettings(json) {

    const settings = JSON.parse(json);


    if (!settings.modules) {

        throw new Error(
            "Invalid settings file."
        );

    }


    Object.entries(settings.modules)
        .forEach(([id, enabled]) => {

            this.setModuleState(
                id,
                enabled
            );

        });

},


resetSettings() {

    FRTools.Module.all().forEach(module => {

        this.setModuleState(
            module.id,
            module.enabledByDefault !== false
        );

    });

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

    description: "Automatically expands hidden sections.",

    version: "1.0.0",

    author: "FR Tools",

    enabledByDefault: true,


    init() {

        console.log(
            "[FR Tools] Auto Expand loaded"
        );

    },


    destroy() {

        console.log(
            "[FR Tools] Auto Expand stopped"
        );

    }

});


// ======================================
// modules/exhibitsort.js
// ======================================

FRTools.Module.register({

    id: "exhibitsort",

    name: "Exhibit Sort",

    description: "Automatically sorts exhibits by PALM number.",

    version: "1.0.0",

    author: "FR Tools",

    enabledByDefault: true,

    observer: null,

    settings: {

    direction: "asc"

        },


    getSortKey(row) {

        return row.textContent.match(
            /\d{6}-[A-Z]-\d{4}-\d{4}/
        )?.[0] || "";

    },


    sortExhibits() {

        const tbody = document.querySelector(
            "#ExhibitTable tbody"
        );


        if (!tbody) {
            return;
        }


        const rows = [
            ...tbody.querySelectorAll("tr")
        ];


        const direction =
            FRTools.Storage.get(
                "exhibitsort_direction",
                "asc"
            );


        rows.sort((a, b) => {

            const result =
                this.getSortKey(a)
                    .localeCompare(
                        this.getSortKey(b)
                    );


            return direction === "desc"
                ? -result
                : result;

        });


        rows.forEach(row => {

            tbody.appendChild(row);

        });


        console.log(
            "[FR Tools] Exhibits sorted"
        );

    },


    addSortButton() {

        const heading = document.querySelector(
            "#Table_AttachedExhibits h3"
        );


        if (!heading) {
            return;
        }


        if (
            document.querySelector(
                "#frtools-sort-exhibits-btn"
            )
        ) {
            return;
        }


        const button = document.createElement(
            "button"
        );


        button.id =
            "frtools-sort-exhibits-btn";


        button.textContent =
            "Sort Exhibits";


        button.type = "button";


        button.style.marginLeft = "10px";
        button.style.padding = "3px 6px";
        button.style.cursor = "pointer";
        button.style.fontSize = "12px";
        button.style.fontWeight = "600";
        button.style.border = "1px solid #999";
        button.style.borderRadius = "4px";
        button.style.backgroundColor = "#f0f0f0";
        button.style.color = "#000";
        button.style.boxShadow =
            "0 1px 2px rgba(0,0,0,0.15)";


        button.addEventListener(
            "click",
            () => {

                this.sortExhibits();

                FRTools.GUI.notify(
                    "Exhibits sorted"
                );

            }
        );


        heading.appendChild(button);

    },


    settingsUI() {

        return `
            <label>
                Sort Direction:

                <select id="exhibitsort-direction">

                    <option value="asc">
                        Ascending
                    </option>

                    <option value="desc">
                        Descending
                    </option>

                </select>

            </label>
        `;

    },


    init() {

        console.log(
            "[FR Tools] Exhibit Sort loaded"
        );


        this.sortExhibits();

        this.addSortButton();


        document.addEventListener(
            "visibilitychange",
            this.visibilityHandler = () => {

                if (!document.hidden) {

                    this.sortExhibits();

                }

            }
        );

    },


    destroy() {

        console.log(
            "[FR Tools] Exhibit Sort stopped"
        );


        if (this.visibilityHandler) {

            document.removeEventListener(
                "visibilitychange",
                this.visibilityHandler
            );

        }


        const button = document.querySelector(
            "#frtools-sort-exhibits-btn"
        );


        if (button) {

            button.remove();

        }

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

