FRTools.Module.register({

    id: "autoexpand",

    name: "Auto Expand",

    description: "Automatically expands hidden exhibit sections on worklists.",

    version: "1.2.0",

    author: "FR Tools",

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


        this.expandHiddenRows();


        if (
            FRTools.Settings.getModuleOption(
                this.id,
                "sortExpandedExhibits"
            )
        ) {

            this.sortExpandedExhibits();

        }


        this.observer = new MutationObserver(() => {

            this.expandHiddenRows();


            if (
                FRTools.Settings.getModuleOption(
                    this.id,
                    "sortExpandedExhibits"
                )
            ) {

                this.sortExpandedExhibits();

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
                    childList: true,
                    subtree: true
                }
            );

        }

    },


    expandHiddenRows() {

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

    },


    sortExpandedExhibits() {

        if (this.sorting) {
            return;
        }

        this.sorting = true;


        console.log(
            "[FR Tools] Sorting expanded exhibits"
        );


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


                const rows =
                    [
                        ...document.querySelectorAll(
                            "." + className
                        )
                    ];


                rows.sort((a, b) => {

                    const aRef =
                        a.textContent.match(
                            /\d{6}-[A-Z]-\d{4}-\d{4}/
                        )?.[0] || "";


                    const bRef =
                        b.textContent.match(
                            /\d{6}-[A-Z]-\d{4}-\d{4}/
                        )?.[0] || "";


                    return aRef.localeCompare(bRef);

                });


                rows.forEach(r => {

                    r.parentNode.appendChild(r);

                });


            });
        this.sorting = false;
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