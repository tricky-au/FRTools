FRTools.Module.register({

    id: "dashboard",

    name: "Dashboard",

    description: "Unit Worklist dashboard.",

    version: "1.0.0",

    enabledByDefault: true,
   
    overlayId:
        "frtools-dashboard-overlay",

    matches(location) {

        return (
            location.pathname.includes(
                "/main/worklists/unit_worklist.cfm"
            )
        );

    },


    init() {

        console.log(
            "[FR Tools] Dashboard loaded"
        );

        this.addStyles();
        this.createButton();


        const stats =
            this.getStats();


        console.log(stats);


    },

    addStyles() {


        GM_addStyle(`


            #frtools-dashboard-button {


                position: fixed;

                bottom: 75px;

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




            #frtools-dashboard-button:hover {


                transform:
                    translateY(-2px);


                box-shadow:
                    0 6px 18px rgba(0,0,0,0.35);


            }




            #frtools-dashboard-overlay {


                position:
                    fixed;


                inset:
                    0;


                background:
                    rgba(0,0,0,0.45);


                z-index:
                    999998;


                display:
                    none;


                align-items:
                    center;


                justify-content:
                    center;


            }




            #frtools-dashboard-modal {


                width:
                    700px;


                max-width:
                    90vw;


                max-height:
                    75vh;


                overflow:
                    auto;


                background:
                    white;


                border-radius:
                    12px;


                box-shadow:
                    0 12px 35px rgba(0,0,0,0.45);


            }




            .frtools-dashboard-header {


                background:
                    rgb(26,38,50);


                color:
                    white;


                text-align:
                    center;


                padding:
                    16px 20px;


                font-size:
                    18px;


                font-weight:
                    700;


                border-radius:
                    12px 12px 0 0;


            }




            .frtools-dashboard-content {


                padding:
                    20px;


                font-size:
                    14px;


            }



            .frtools-dashboard-card {


                background:
                    rgb(235,235,235);


                border:
                    1px solid #ccc;


                border-radius:
                    8px;


                padding:
                    16px;


                margin-bottom:
                    12px;


            }



        `);


    },

    createButton() {


        if (
            document.getElementById(
                "frtools-dashboard-button"
            )
        ) {

            return;

        }



        const button =
            document.createElement(
                "button"
            );


        button.id =
            "frtools-dashboard-button";


        button.textContent =
            "Dashboard";



        button.addEventListener(
            "click",
            () => {

                this.openDashboard();

            }
        );



        document.body.appendChild(
            button
        );


    },



    openDashboard() {


        let overlay =
            document.getElementById(
                this.overlayId
            );


        let modal =
            document.getElementById(
                "frtools-dashboard-modal"
            );



        if (!overlay) {


            overlay =
                document.createElement(
                    "div"
                );


            overlay.id =
                this.overlayId;



            overlay.innerHTML = `


                <div id="frtools-dashboard-modal">


                    <div class="frtools-dashboard-header">

                        FR Tools Dashboard

                    </div>


                    <div class="frtools-dashboard-content">

                    </div>


                </div>


            `;



            document.body.appendChild(
                overlay
            );



            overlay.addEventListener(
                "click",
                event => {


                    if (
                        event.target === overlay
                    ) {

                        this.closeDashboard();

                    }


                }
            );


            modal =
                document.getElementById(
                    "frtools-dashboard-modal"
                );


        }



        const stats =
            this.getStats();



        modal.querySelector(
            ".frtools-dashboard-content"
        )
        .innerHTML = `


            <div>

                Total Jobs:

                <strong>
                    ${stats.totalJobs}
                </strong>


            </div>


        `;



        overlay.style.display =
            "flex";



        document.addEventListener(
            "keydown",
            this.escapeHandler
        );


    },

    closeDashboard() {


        const overlay =
            document.getElementById(
                this.overlayId
            );


        if (!overlay) {

            return;

        }



        overlay.style.display =
            "none";



        document.removeEventListener(
            "keydown",
            this.escapeHandler
        );


    },


    escapeHandler(event) {


        if (
            event.key === "Escape"
        ) {

            FRTools.Module
                .get("dashboard")
                .closeDashboard();

        }


    },

    getTable() {

        return jQuery(
            "#UnitWorklistTable"
        ).DataTable();

    },



    getJobs() {

        return this
            .getTable()
            .rows()
            .data()
            .toArray();

    },



    getStats() {


        const jobs =
            this.getJobs();



        return {


            totalJobs:
                jobs.length


        };


    },


});