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