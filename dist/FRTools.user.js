// ==UserScript==
// @name         FR Tools
// @author       Nick Filipovic (DFU)
// @namespace    FRTOOLS
// @version      4.1.5
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

        let notification =
            document.getElementById(
                "frtools-notification"
            );


        if (!notification) {

            notification =
                document.createElement("div");

            notification.id =
                "frtools-notification";

            document.body.appendChild(
                notification
            );

        }


        notification.textContent =
            message;

        notification.classList.add(
            "show"
        );


        setTimeout(() => {

            notification.classList.remove(
                "show"
            );

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

                box-shadow:
                    0 3px 10px rgba(0,0,0,0.25);

            }


            #frtools-modal {

                position: fixed;

                top: 50%;

                left: 50%;

                transform:
                    translate(-50%, -50%);

                width: 520px;

                max-height: 70vh;

                overflow: auto;

                background: white;

                z-index: 1000000;

                border-radius: 10px;

                box-shadow:
                    0 10px 30px rgba(0,0,0,0.4);

                display: none;

                padding: 16px;

            }


            #frtools-overlay {

                position: fixed;

                inset: 0;

                background:
                    rgba(0,0,0,0.4);

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


            .frtools-module-option {

                margin-left: 28px;

                margin-top: 6px;

                margin-bottom: 10px;

                font-size: 13px;

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

                box-shadow:
                    0 4px 12px rgba(0,0,0,0.3);

                opacity: 0;

                transition:
                    opacity 0.3s ease;

            }


            #frtools-notification.show {

                opacity: 1;

            }


        `);

    },


    createUI() {

        const btn =
            document.createElement(
                "button"
            );

        btn.id =
            "frtools-button";

        btn.textContent =
            "FR Tools";


        const overlay =
            document.createElement(
                "div"
            );

        overlay.id =
            "frtools-overlay";


        const modal =
            document.createElement(
                "div"
            );

        modal.id =
            "frtools-modal";


        const title =
            document.createElement(
                "div"
            );

        title.className =
            "frtools-title";

        title.textContent =
            "FR Tools";


        modal.appendChild(
            title
        );


        const moduleSection =
            document.createElement(
                "div"
            );

        moduleSection.className =
            "frtools-section";


        const moduleHeading =
            document.createElement(
                "strong"
            );

        moduleHeading.textContent =
            "Modules";


        moduleSection.appendChild(
            moduleHeading
        );


        const moduleContainer =
            document.createElement(
                "div"
            );

        moduleContainer.id =
            "frtools-modules";


        modal.appendChild(
            moduleSection
        );


        moduleSection.appendChild(
            moduleContainer
        );


        this.renderModules(
            moduleContainer
        );


        const settingsSection =
            document.createElement(
                "div"
            );

        settingsSection.className =
            "frtools-section";


        settingsSection.innerHTML = `

            <strong>
                Settings
            </strong>

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


        modal.appendChild(
            settingsSection
        );

        const importInput =
            document.createElement(
                "input"
            );

        importInput.type =
            "file";

        importInput.accept =
            "application/json";

        importInput.style.display =
            "none";


        document.body.appendChild(
            importInput
        );


        settingsSection
            .querySelector(
                "#frtools-export-settings"
            )
            .addEventListener(
                "click",
                () => {

                    const json =
                        FRTools.Settings.exportSettings();


                    const blob =
                        new Blob(
                            [
                                json
                            ],
                            {
                                type:
                                    "application/json"
                            }
                        );


                    const url =
                        URL.createObjectURL(
                            blob
                        );


                    const link =
                        document.createElement(
                            "a"
                        );


                    link.href =
                        url;


                    link.download =
                        "FRTools-Settings.json";


                    document.body.appendChild(
                        link
                    );


                    link.click();


                    document.body.removeChild(
                        link
                    );


                    URL.revokeObjectURL(
                        url
                    );


                    FRTools.GUI.notify(
                        "Settings exported"
                    );

                }
            );


        settingsSection
            .querySelector(
                "#frtools-import-settings"
            )
            .addEventListener(
                "click",
                () => {

                    importInput.click();

                }
            );


        importInput.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];


                if (!file) {

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload = () => {

                    try {

                        FRTools.Settings.importSettings(
                            reader.result
                        );


                        this.renderModules(
                            document.getElementById(
                                "frtools-modules"
                            )
                        );


                        FRTools.GUI.notify(
                            "Settings imported"
                        );


                    }
                    catch(error) {

                        console.error(
                            "[FR Tools] Import failed",
                            error
                        );


                        FRTools.GUI.notify(
                            "Import failed"
                        );

                    }

                };


                reader.readAsText(
                    file
                );

            }
        );


        settingsSection
            .querySelector(
                "#frtools-reset-settings"
            )
            .addEventListener(
                "click",
                () => {

                    const confirmed =
                        confirm(
                            "Reset FR Tools settings?\n\nThis will restore all modules to their default state."
                        );


                    if (!confirmed) {

                        return;

                    }


                    FRTools.Settings.resetSettings();


                    this.renderModules(
                        document.getElementById(
                            "frtools-modules"
                        )
                    );


                    FRTools.GUI.notify(
                        "Settings reset"
                    );

                }
            );


        function open() {

            overlay.style.display =
                "block";


            modal.style.display =
                "block";


            FRTools.state.uiOpen =
                true;

        }


        function close() {

            overlay.style.display =
                "none";


            modal.style.display =
                "none";


            FRTools.state.uiOpen =
                false;

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
                    "[data-module-option]"
                )
            ) {

                const value =
                    event.target.type === "checkbox"
                        ? event.target.checked
                        : event.target.value;

                FRTools.Settings.setModuleOption(
                    event.target.dataset.moduleOption,
                    event.target.dataset.option,
                    value
                );

                FRTools.GUI.notify(
                    `${event.target.dataset.option} updated`
                );

                return;

            }



                if (
                    !event.target.matches(
                        "input[data-module]"
                    )
                ) {

                    return;

                }


                const moduleId =
                    event.target.dataset.module;


                if (event.target.checked) {

                    FRTools.Module.enable(
                        moduleId
                    );

                }
                else {

                    FRTools.Module.disable(
                        moduleId
                    );

                }


            }
        );


        document.body.appendChild(
            btn
        );


        document.body.appendChild(
            overlay
        );


        document.body.appendChild(
            modal
        );

    },


    renderModules(container) {

        if (!container) {

            return;

        }


        container.innerHTML =
            "";


        FRTools.Module.all()
            .forEach(module => {


                const enabled =
                    FRTools.Settings.getModuleState(
                        module.id,
                        module.enabledByDefault !== false
                    );


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "frtools-module";


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

                            Version:
                            ${module.version || "1.0.0"}

                            <br>

                            Author:
                            ${module.author || "Unknown"}

                        </small>

                    </label>

                `;


                container.appendChild(
                    row
                );

                if (module.options) {

                    Object.entries(
                        module.options
                    )
                    .forEach(
                        ([optionId, option]) => {


                            const optionValue =
                                FRTools.Settings.getModuleOption(
                                    module.id,
                                    optionId
                                );


                            const optionContainer =
                                document.createElement(
                                    "div"
                                );


                            optionContainer.className =
                                "frtools-module-option";


                            let control = "";


                            /*
                            * Select option
                            */

                            if (
                                option.type === "select"
                            ) {


                                const values =
                                    typeof option.values === "function"
                                        ? option.values()
                                        : [];


                                control = `

                                    <select
                                        data-module-option="${module.id}"
                                        data-option="${optionId}"
                                    >

                                        ${
                                            values.map(item => `

                                                <option
                                                    value="${item.value}"
                                                    ${
                                                        optionValue === item.value
                                                            ? "selected"
                                                            : ""
                                                    }
                                                >
                                                    ${item.label}
                                                </option>

                                            `).join("")
                                        }

                                    </select>

                                `;

                            }


                            /*
                            * Default checkbox option
                            */

                            else {

                                control = `

                                    <input
                                        type="checkbox"
                                        data-module-option="${module.id}"
                                        data-option="${optionId}"
                                        ${optionValue ? "checked" : ""}
                                    >

                                `;

                            }


                            optionContainer.innerHTML = `

                                ${control}


                                <label>

                                    <strong>
                                        ${option.name}
                                    </strong>


                                    <br>


                                    <small>
                                        ${option.description || ""}
                                    </small>

                                </label>

                            `;


                            container.appendChild(
                                optionContainer
                            );


                        }
                    );

                }



                if (
                    typeof module.settingsUI === "function"
                ) {


                    const settings =
                        module.settingsUI();


                    if (settings) {


                        const option =
                            document.createElement(
                                "div"
                            );


                        option.className =
                            "frtools-module-option";


                        option.innerHTML =
                            settings.html;


                        container.appendChild(
                            option
                        );


                        if (
                            typeof settings.init === "function"
                        ) {


                            settings.init(
                                option
                            );


                        }

                    }

                }


            });


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


                if (!enabled) {

                    console.log(
                        `[FR Tools] Disabled module: ${module.id}`
                    );

                    return;

                }


                if (
                    typeof module.matches === "function" &&
                    !module.matches(window.location)
                ) {

                    console.log(
                        `[FR Tools] Skipping module (page mismatch): ${module.id}`
                    );

                    return;

                }


                if (
                    typeof module.init === "function"
                ) {

                    console.log(
                        `[FR Tools] Starting module: ${module.id}`
                    );

                    module.init();

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


    getModuleOption(id, option) {

        const module =
            FRTools.Module.get(id);


        if (
            !module ||
            !module.options ||
            !module.options[option]
        ) {

            console.warn(
                `[FR Tools] Unknown module option: ${id}.${option}`
            );

            return undefined;

        }


        const key =
            `module_${id}_option_${option}`;


        return FRTools.Storage.get(
            key,
            module.options[option].default ?? false
        );

    },


    setModuleOption(id, option, value) {

        const key =
            `module_${id}_option_${option}`;


        FRTools.Storage.set(
            key,
            value
        );

    },


    exportSettings() {

        const settings = {

            version: 1,

            modules: {},

            options: {}

        };


        FRTools.Module.all().forEach(module => {

            settings.modules[module.id] =
                this.getModuleState(
                    module.id,
                    module.enabledByDefault !== false
                );


            if (module.options) {

                settings.options[module.id] = {};


                Object.keys(module.options)
                    .forEach(option => {

                        settings.options[module.id][option] =
                            this.getModuleOption(
                                module.id,
                                option
                            );

                    });

            }

        });


        return JSON.stringify(
            settings,
            null,
            2
        );

    },


    importSettings(json) {

        const settings =
            JSON.parse(json);


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


        if (settings.options) {

            Object.entries(settings.options)
                .forEach(([id, options]) => {

                    Object.entries(options)
                        .forEach(([option, value]) => {

                            this.setModuleOption(
                                id,
                                option,
                                value
                            );

                        });

                });

        }

    },


    resetSettings() {

        FRTools.Module.all().forEach(module => {

            this.setModuleState(
                module.id,
                module.enabledByDefault !== false
            );


            if (module.options) {

                Object.keys(module.options)
                    .forEach(option => {

                        this.setModuleOption(
                            module.id,
                            option,
                            module.options[option].default ?? false
                        );

                    });

            }

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

    description: "Automatically expands hidden exhibit sections on worklists.",

    version: "1.2.0",

    enabledByDefault: false,


    options: {

        sortExpandedExhibits: {

            name: "Sort expanded exhibits",

            description:
                "Sort exhibits after expanding hidden worklist sections.",

            default: false

        }

    },


    matches(location) {

        return (
            location.pathname.includes(
                "/main/worklists/personal_worklist.cfm"
            )
            ||
            location.pathname.includes(
                "/main/worklists/unit_worklist.cfm"
            )
        );

    },


    init() {

        console.log(
            "[FR Tools] Auto Expand loaded"
        );


        this.sorting = false;


        this.expandHiddenRows();


        if (
            FRTools.Settings.getModuleOption(
                this.id,
                "sortExpandedExhibits"
            )
        ) {

            this.sortExpandedExhibits();

        }


        let sortTimer = null;


        this.observer = new MutationObserver(() => {


            this.expandHiddenRows();


            if (
                FRTools.Settings.getModuleOption(
                    this.id,
                    "sortExpandedExhibits"
                )
            ) {


                clearTimeout(sortTimer);


                sortTimer = setTimeout(() => {

                    this.sortExpandedExhibits();

                }, 500);

            }


        });


        const tbody =
            document.querySelector(
                "tbody"
            );


        if (tbody) {

            this.observer.observe(
                tbody,
                {
                    childList: true
                }
            );

        }

    },


    expandHiddenRows() {

        if (this.expanding) {
            return;
        }

        this.expanding = true;

        try {

            document
                .querySelectorAll(
                    'tr.fr_childrow[style*="display:none"]'
                )
                .forEach(row => {

                    row.style.display = "";

                });


            document
                .querySelectorAll(
                    "tr.fr_childrow"
                )
                .forEach(row => {

                    const text =
                        row.textContent
                            .trim()
                            .toLowerCase();


                    if (
                        text.includes("exhibits hidden") ||
                        text.includes("exhibis hidden")
                    ) {

                        row.style.display = "none";

                    }

                });

        }
        finally {

            this.expanding = false;

        }

    },


    sortExpandedExhibits() {

        if (this.sorting) {
            return;
        }


        this.sorting = true;


        console.log(
            "[FR Tools] Sorting expanded exhibits"
        );


        try {

            const groups = {};


            document
                .querySelectorAll(
                    "tr[class*='childRow_Report-']"
                )
                .forEach(row => {


                    const className =
                        [...row.classList]
                            .find(
                                c =>
                                c.startsWith(
                                    "childRow_Report-"
                                )
                            );


                    if (!className) {
                        return;
                    }


                    if (!groups[className]) {

                        groups[className] = [];

                    }


                    groups[className].push(row);


                });



            Object.values(groups)
                .forEach(rows => {


                    if (rows.length < 2) {
                        return;
                    }


                    rows.sort((a, b) => {


                        const aRef =
                            a.textContent.match(
                                /\d{6}-[A-Z]-\d{4}-\d{4}/
                            )?.[0] || "";


                        const bRef =
                            b.textContent.match(
                                /\d{6}-[A-Z]-\d{4}-\d{4}/
                            )?.[0] || "";


                        return aRef.localeCompare(
                            bRef
                        );


                    });



                    const parent =
                        rows[0].parentNode;


                    const placeholder =
                        document.createComment(
                            "FR Tools exhibit sort"
                        );


                    parent.insertBefore(
                        placeholder,
                        rows[0]
                    );


                    const fragment =
                        document.createDocumentFragment();


                    rows.forEach(row => {

                        fragment.appendChild(row);

                    });


                    placeholder.parentNode.insertBefore(
                        fragment,
                        placeholder
                    );


                    placeholder.remove();


                });


        }
        finally {

            setTimeout(() => {

                this.sorting = false;

            }, 1000);

        }

    },


    destroy() {

        if (this.observer) {

            this.observer.disconnect();

            this.observer = null;

        }


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

    description: "Automatically sorts exhibits by PALM number in Requests/Tasks.",

    version: "1.0.0",

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

            const moduleName = this.name;

            return {

                html: `

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

                `,


                init(container) {

                    const select =
                        container.querySelector(
                            "#exhibitsort-direction"
                        );


                    if (!select) {
                        return;
                    }


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
                                `${moduleName}: ${
                                    select.value === "asc"
                                        ? "Ascending"
                                        : "Descending"
                                }`
                            );

                        }
                    );

                }

            };

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
// modules/favicons.js
// ======================================

FRTools.Module.register({

    id: "favicons",

    name: "Dynamic Favicons",

    description:
        "Replace page favicons with icons based on the current page.",

    version: "1.0.0",

    enabledByDefault: false,


    options: {

        enabled: {

            type: "checkbox",

            name:
                "Enable Dynamic Favicons",

            description:
                "Replace the default favicon with page-specific icons.",

            default: true

        }

    },


    matches() {

        return true;

    },


    init() {

        console.log(
            "[FR Tools] Dynamic Favicons loaded"
        );


        this.updateFavicon();

    },


    updateFavicon() {

        if (

            !FRTools.Settings.getModuleOption(

                this.id,

                "enabled"

            )

        ) {

            return;

        }


        /*
            Test only on Exhibit Record pages.
        */

        if (

            !location.pathname.includes(

                "/main/exhibit/exhibit_record.cfm"

            )

        ) {

            return;

        }


        console.log(

            "[FR Tools] Setting test favicon"

        );


const svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 64 64">

    <rect
        x="18"
        y="6"
        width="28"
        height="52"
        rx="5"
        fill="#1976d2"/>

    <rect
        x="22"
        y="12"
        width="20"
        height="36"
        rx="2"
        fill="white"/>

    <circle
        cx="32"
        cy="53"
        r="2.5"
        fill="white"/>

</svg>`;


        const favicon =
            "data:image/svg+xml," +
            encodeURIComponent(svg);


        let link =
            document.querySelector(
                "link[rel*='icon']"
            );


        if (!link) {

            link =
                document.createElement(
                    "link"
                );

            link.rel =
                "icon";

            document.head.appendChild(
                link
            );

        }


        link.href =
            favicon;

    },


    destroy() {

        console.log(
            "[FR Tools] Dynamic Favicons stopped"
        );

    }

});


// ======================================
// modules/tabtitles.js
// ======================================

FRTools.Module.register({

    id: "tabtitles",

    name: "Tab Titles",

    description:
        "Customise browser tab titles for better visibility of what page you're on.",

    version: "1.2.0",

    enabledByDefault: false,


    fields: {

        P: {
            label: "Property Item ID"
        },

        F: {
            label: "FR Number"
        },

        O: {
            label: "OP Name"
        }

    },


    pageTitles: {

        "personal_worklist.cfm":
            "Personal Worklist",

        "unit_worklist.cfm":
            "Unit Worklist",

        "exhibit_record_move.cfm":
            "Move Exhibit",

        "exhibit_record_transfer.cfm":
            "Transfer Exhibit",

        "exhibit_record.cfm":
            "Exhibit Record",

        "report_record.cfm":
            "Report Record",

        "exam_record.cfm":
            "Examination Record"

    },


    options: {

        exhibitFormat: {

            type: "select",

            name:
                "Exhibit Record Format",

            description:
                "Choose how exhibit record tab titles are displayed.",

            default:
                "P,F,O",

            values() {

                const module =
                    FRTools.Module.get(
                        "tabtitles"
                    );

                return module
                    .getFormats([
                        "P",
                        "F",
                        "O"
                    ])
                    .map(format => ({

                        value: format,

                        label:
                            module.getLabels(
                                format
                            )

                    }));

            }

        },


        reportFormat: {

            type: "select",

            name:
                "Report Record Format",

            description:
                "Choose how report record tab titles are displayed.",

            default:
                "F,O",

            values() {

                const module =
                    FRTools.Module.get(
                        "tabtitles"
                    );

                return module
                    .getFormats([
                        "F",
                        "O"
                    ])
                    .map(format => ({

                        value: format,

                        label:
                            module.getLabels(
                                format
                            )

                    }));

            }

        },


        examinationFormat: {

            type: "select",

            name:
                "Examination Record Format",

            description:
                "Choose how examination record tab titles are displayed.",

            default:
                "P,F,O",

            values() {

                const module =
                    FRTools.Module.get(
                        "tabtitles"
                    );

                return module
                    .getFormats([
                        "P",
                        "F",
                        "O"
                    ])
                    .map(format => ({

                        value: format,

                        label:
                            module.getLabels(
                                format
                            )

                    }));

            }

        },


        enableGenericTitles: {

            type: "checkbox",

            name:
                "Enable Generic Page Titles",

            description:
                "Replace generic Forensic Register page titles with useful page names.",

            default: true

        }

    },


    matches() {

        return true;

    },


    init() {

        console.log(
            "[FR Tools] Tab Titles loaded"
        );


        setTimeout(() => {

            this.updateTitle();

        }, 500);


        this.observeChanges();

    },


    getPropertyItemId() {

        const label =
            [...document.querySelectorAll("td")]
                .find(td =>
                    td.textContent.includes(
                        "Property Item ID:"
                    )
                );


        return label
            ?.nextElementSibling
            ?.textContent
            .trim() || "";

    },


    getExaminationPropertyItemId() {

        const match =
            document.querySelector(
                "#exhibitsExaminedTable td.fr_width_1-5"
            );


        if (!match) {

            return "";

        }


        const lines =
            match.innerText
                .trim()
                .split("\n")
                .map(v => v.trim())
                .filter(Boolean);


        return lines.length > 1
            ? lines[1]
            : "";

    },


    getForensicNumber() {

        return document.querySelector(
            ".fr_forensic_number"
        )?.textContent.trim() || "";

    },


    getOperationName() {

        return document.querySelector(
            ".fr_operation_name"
        )?.textContent.trim() || "";

    },

    getFieldValue(key) {

        switch (key) {

            case "P":

                if (this.isExaminationPage()) {

                    return this.getExaminationPropertyItemId();

                }

                return this.getPropertyItemId();


            case "F":

                return this.getForensicNumber();


            case "O":

                return this.getOperationName();


            default:

                return "";

        }

    },


    getFormats(keys) {

        const results = [];


        const permute = (
            current,
            remaining
        ) => {

            if (current.length) {

                results.push(
                    current.join(",")
                );

            }


            remaining.forEach((key, index) => {

                permute(

                    [...current, key],

                    remaining.filter(
                        (_, i) => i !== index
                    )

                );

            });

        };


        permute([], keys);

        return results;

    },


    getLabels(format) {

        return format

            .split(",")

            .map(key =>
                this.fields[key].label
            )

            .join(" | ");

    },


    getFormattedTitle(format) {

        return format

            .split(",")

            .map(key =>
                this.getFieldValue(key)
            )

            .filter(Boolean)

            .join(" | ");

    },


    getCurrentPageTitle() {

        const file =

            location.pathname

                .split("/")

                .pop();


        if (

            this.pageTitles[file]

        ) {

            return this.pageTitles[file];

        }


        return file

            .replace(".cfm", "")

            .replaceAll("_", " ")

            .replace(/\b\w/g, c =>
                c.toUpperCase()
            );

    },


    isExhibitPage() {

        return location.pathname.includes(

            "/main/exhibit/exhibit_record.cfm"

        );

    },


    isReportPage() {

        return location.pathname.includes(

            "/main/report/report_record.cfm"

        );

    },


    isExaminationPage() {

        return location.pathname.includes(

            "/main/exam/exam_record.cfm"

        );

    },


    updateTitle() {

        let title = "";


        if (

            this.isExhibitPage()

        ) {

            title = this.getFormattedTitle(

                FRTools.Settings.getModuleOption(

                    this.id,

                    "exhibitFormat"

                )

            );

        }

        else if (

            this.isReportPage()

        ) {

            title = this.getFormattedTitle(

                FRTools.Settings.getModuleOption(

                    this.id,

                    "reportFormat"

                )

            );

        }

        else if (

            this.isExaminationPage()

        ) {

            title = this.getFormattedTitle(

                FRTools.Settings.getModuleOption(

                    this.id,

                    "examinationFormat"

                )

            );

        }

        else if (

            FRTools.Settings.getModuleOption(

                this.id,

                "enableGenericTitles"

            )

        ) {

            title = this.getCurrentPageTitle();

        }


        if (

            title &&

            document.title !== title

        ) {

            document.title = title;

        }

    },

    observeChanges() {

        let updateTimer = null;


        this.titleObserver =
            new MutationObserver(() => {

                clearTimeout(
                    updateTimer
                );


                updateTimer =
                    setTimeout(() => {

                        this.updateTitle();

                    }, 1000);

            });


        this.titleObserver.observe(

            document.body,

            {

                childList: true,

                subtree: true

            }

        );


        /*
            Refresh title immediately
            when settings change.
        */

        document.addEventListener(

            "change",

            event => {

                if (

                    event.target.matches(

                        '[data-module-option="tabtitles"]'

                    )

                ) {

                    this.updateTitle();

                }

            }

        );

    },


    destroy() {

        if (

            this.titleObserver

        ) {

            this.titleObserver.disconnect();

            this.titleObserver = null;

        }


        console.log(

            "[FR Tools] Tab Titles stopped"

        );

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

