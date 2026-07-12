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