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
                        "input[data-module-option]"
                    )
                ) {


                    FRTools.Settings.setModuleOption(
                        event.target.dataset.moduleOption,
                        event.target.dataset.option,
                        event.target.checked
                    );


                    FRTools.GUI.notify(
                        `${event.target.dataset.option}: ${
                            event.target.checked
                            ? "Enabled"
                            : "Disabled"
                        }`
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


                            const optionEnabled =
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


                            optionContainer.innerHTML = `

                                <input
                                    type="checkbox"
                                    data-module-option="${module.id}"
                                    data-option="${optionId}"
                                    ${optionEnabled ? "checked" : ""}
                                >


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