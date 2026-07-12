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