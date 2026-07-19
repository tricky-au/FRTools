FRTools.Module.register({

    id: "dashboard",

    name: "Dashboard",

    description: "Unit Worklist dashboard.",

    version: "1.0.0",

    enabledByDefault: true,


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


        this.createButton();


        const stats =
            this.getStats();


        console.log(stats);


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


        let modal =
            document.getElementById(
                "frtools-dashboard-modal"
            );



        if (!modal) {


            modal =
                document.createElement(
                    "div"
                );


            modal.id =
                "frtools-dashboard-modal";


            modal.innerHTML = `

                <div class="frtools-dashboard-header">

                    FR Tools Dashboard

                </div>


                <div class="frtools-dashboard-content">

                </div>

            `;


            document.body.appendChild(
                modal
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



        modal.style.display =
            "block";


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