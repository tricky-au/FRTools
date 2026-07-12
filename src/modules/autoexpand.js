FRTools.Module.register({

    id: "autoexpand",

    name: "Auto Expand",

    description: "Automatically expands hidden exhibit sections on worklists.",

    version: "1.1.0",

    author: "FR Tools",

    enabledByDefault: false,


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

        this.observer = new MutationObserver(() => {

            this.expandHiddenRows();

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