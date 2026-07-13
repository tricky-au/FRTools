FRTools.GUI = {

    notify(message) {

        let notification =
            document.getElementById(
                "frtools-notification"
            );


        if (!notification) {

            notification =
                document.createElement(
                    "div"
                );

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


            :root {

                --fr-dark:
                    rgb(26,38,50);

                --fr-grey:
                    rgb(235,235,235);

                --fr-white:
                    rgb(255,255,255);

            }

            #frtools-modal::-webkit-scrollbar {

                width: 10px;

            }


            #frtools-modal::-webkit-scrollbar-track {

                background: #ebebeb;

                border-radius: 10px;

            }


            #frtools-modal::-webkit-scrollbar-thumb {

                background: #1a2632;

                border-radius: 10px;

                border: 2px solid #ebebeb;

            }


            #frtools-modal::-webkit-scrollbar-thumb:hover {

                background: #263746;

            }

                .frtools-option-header {

                display: flex;

                align-items: center;

                justify-content: flex-start;

                gap: 20px;

            }


.frtools-option-header select {

    width: 260px;

    flex-shrink: 0;

    font-size: 12px;

}

            .frtools-option-header input {

                margin-top: 3px;

            }


            .frtools-option-group-title {

                font-weight: 600;

                font-size: 13px;

            }


            .frtools-module-description {

                font-size: 12px;

                color: #555;

                margin-top: 3px;

            }

            #frtools-button {

                position: fixed;

                bottom: 20px;

                right: 20px;

                z-index: 999999;


                background:
                    rgb(26,38,50);


                color:
                    white;


                border:
                    none;


                border-radius:
                    8px;


                padding:
                    12px 18px;


                font-size:
                    14px;


                font-weight:
                    600;


                cursor:
                    pointer;


                box-shadow:
                    0 4px 14px rgba(0,0,0,0.3);


                transition:
                    transform 0.2s ease,
                    box-shadow 0.2s ease;

            }



            #frtools-button:hover {

                transform:
                    translateY(-2px);


                box-shadow:
                    0 6px 18px rgba(0,0,0,0.35);

            }




            #frtools-modal {

                position: fixed;

                top: 50%;

                left: 50%;


                transform:
                    translate(-50%, -50%);


                width:
                    650px;

                max-width: 90vw;


                max-height:
                    75vh;


                overflow:
                    auto;


                background:
                    rgb(255,255,255);


                z-index:
                    1000000;


                border-radius:
                    12px;


                box-shadow:
                    0 12px 35px rgba(0,0,0,0.45);


                display:
                    none;


                padding:
                    0;

            }




            #frtools-modal-header {

            text-align: center;

                background:
                    rgb(26,38,50);

                padding-top: 20px;

                color:
                    white;


                padding:
                    16px 20px;


                font-size:
                    18px;


                font-weight:
                    700;


                border-radius:
                    12px 12px 0 0;

            }




            #frtools-modal-content {

                padding:
                    18px;

            }




            #frtools-overlay {

                position:
                    fixed;


                inset:
                    0;


                background:
                    rgba(0,0,0,0.45);


                z-index:
                    999999;


                display:
                    none;

            }




            .frtools-section {

                margin-bottom:
                    16px;


                padding:
                    14px;


                background:
                    rgb(235,235,235);


                border:
                    1px solid #ccc;


                border-radius:
                    8px;

            }




            .frtools-section-title {

                font-size:
                    15px;

                text-align: center;


                font-weight:
                    700;


                color:
                    rgb(26,38,50);


                margin-bottom:
                    12px;

            }




            .frtools-module {

                display: flex;

                align-items: flex-start;

                gap: 10px;

                margin: 10px 0;

                padding: 12px;

                background: #ffffff;

                border: 1px solid #ebebeb;

                border-radius: 8px;

                transition:
                    border-color 0.2s ease,
                    box-shadow 0.2s ease;

            }


            .frtools-module:hover {

                border-color: #1a2632;

                box-shadow:
                    0 2px 8px rgba(0,0,0,0.12);

            }


            .frtools-module input[type="checkbox"] {

                margin-top: 3px;

            }

            .frtools-config-buttons {

                display: flex;

                justify-content: center;

                gap: 10px;

                margin-top: 10px;

            }


            .frtools-config-buttons button {

                padding: 6px 12px;

                font-size: 12px;

                border-radius: 5px;

                border: 1px solid #ccc;

                background: #1a2632;

                color: white;

                cursor: pointer;

            }


            .frtools-config-buttons button:hover {

                opacity: 0.85;

            }


            .frtools-module small {

                font-size: 11px;

                color: #555;

                line-height: 1.3;

            }


            .frtools-module-description {

                color: #555;

                font-size: 12px;

                line-height: 1.4;

                margin-top: 4px;

            }

            .frtools-module:hover {

                border-color:
                    rgb(26,38,50);

            }




            .frtools-module label {

                cursor:
                    pointer;

            }




            .frtools-module-description {

                margin-top:
                    4px;


                color:
                    #555;


                font-size:
                    12px;

            }




            .frtools-module-option {

                margin-left: 32px;

                margin-top: 8px;

                margin-bottom: 12px;

                padding-left: 12px;
                
                font-size: 11px;

                color: #666;

                border-left:

                    3px solid #ebebeb;

            }


            .frtools-module-option select {

                margin-top: 6px;

                padding: 5px 8px;

                min-width: 260px;

                border-radius: 5px;

                border: 1px solid #ccc;

                background: white;

                color: #1a2632;

                font-size: 12px;

            }

            #frtools-modal-header {

            background: #1a2632;

            text-align: center;

            color: white;

            padding: 12px 16px;

            padding-top: 20px;

            margin: -16px -16px 16px -16px;

            border-radius:

                10px 10px 0 0;

            font-size: 18px;

            font-weight: 700;

        }

            .frtools-module-option select:focus {

                outline:

                    2px solid #1a2632;

            }

            .frtools-option-group {

                margin-top:
                    14px;


                padding-top:
                    8px;


                border-top:
                    1px solid #ddd;

            }




            .frtools-option-group-title {

                font-weight:
                    700;


                color:
                    rgb(26,38,50);


                margin-bottom:
                    5px;

            }




            select {

                padding:
                    5px 8px;


                border-radius:
                    5px;


                border:
                    1px solid #aaa;

            }




            button {

                cursor:
                    pointer;

            }




            #frtools-notification {

                position:
                    fixed;


                bottom:
                    80px;


                right:
                    20px;


                z-index:
                    1000001;


                background:
                    rgb(26,38,50);


                color:
                    white;


                padding:
                    12px 18px;


                border-radius:
                    8px;


                font-size:
                    13px;


                box-shadow:
                    0 4px 12px rgba(0,0,0,0.3);


                opacity:
                    0;


                transition:
                    opacity 0.3s ease;

            }




            #frtools-notification.show {

                opacity:
                    1;

            }




            .frtools-footer {

                text-align:
                    center;


                padding:
                    12px;


                color:
                    #555;


                font-size:
                    12px;

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



        const header =
            document.createElement(
                "div"
            );


        header.id =
            "frtools-modal-header";


        header.innerHTML = `

            FR Tools

        `;



        const content =
            document.createElement(
                "div"
            );


        content.id =
            "frtools-modal-content";



        modal.appendChild(
            header
        );


        modal.appendChild(
            content
        );



        /*
            Modules section
        */


        const moduleSection =
            document.createElement(
                "div"
            );


        moduleSection.className =
            "frtools-section";



        moduleSection.innerHTML = `

            <div class="frtools-section-title">

                Modules

            </div>

        `;



        const moduleContainer =
            document.createElement(
                "div"
            );


        moduleContainer.id =
            "frtools-modules";



        moduleSection.appendChild(
            moduleContainer
        );



        content.appendChild(
            moduleSection
        );



        this.renderModules(
            moduleContainer
        );




        /*
            Configuration section
        */


        const settingsSection =
            document.createElement(
                "div"
            );


        settingsSection.className =
            "frtools-section";



        settingsSection.innerHTML = `


            <div class="frtools-section-title">

                Configuration

            </div>



           <div class="frtools-config-buttons">

            <button id="frtools-export-settings">
                Export Settings
            </button>


            <button id="frtools-import-settings">
                Import Settings
            </button>


            <button id="frtools-reset-settings">
                Reset Settings
            </button>

        </div>


        `;



        content.appendChild(
            settingsSection
        );




        /*
            About section
        */


        const aboutSection =
            document.createElement(
                "div"
            );


        aboutSection.className =
            "frtools-footer";



        const version =
            GM_info.script.version ||
            "Unknown";



        aboutSection.innerHTML = `


            FR Tools v${version}


        `;



        content.appendChild(
            aboutSection
        );





        /*
            Hidden import file input
        */


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





        /*
            Export settings
        */


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





        /*
            Import settings
        */


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





        /*
            Reset settings
        */


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



                if (
                    event.target.checked
                ) {


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



                        <div class="frtools-module-description">

                            ${module.description || ""}

                        </div>



                    </label>


                `;



                container.appendChild(
                    row
                );






                /*
                    Module options
                */


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





                            let control =
                                "";





                            /*
                                Select control
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
                                            values
                                            .map(item => `


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


                                            `)
                                            .join("")
                                        }



                                    </select>



                                `;



                            }






                            /*
                                Checkbox control
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


                                <div class="frtools-option-header">
                                ${control}

                                    <div>

                                        <div class="frtools-option-group-title">

                                            ${option.name}

                                        </div>


                                        <div class="frtools-module-description">

                                            ${option.description || ""}

                                        </div>

                                    </div>


                                    


                                </div>


                        `;





                            container.appendChild(
                                optionContainer
                            );



                        }
                    );


                }






                /*
                    Custom module settings UI
                */


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