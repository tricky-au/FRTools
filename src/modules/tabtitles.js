FRTools.Module.register({

    id: "tabtitles",

    name: "Tab Titles",

    description:
        "Customise browser tab title for better visibility of what page you're on.",

    version: "1.1.0",


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


    reportFields: {

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

        "exhibit_record.cfm":
            "Exhibit Record",

        "report_record.cfm":
            "Report Record"

    },


    enabledByDefault: false,


    options: {


        exhibitFormat: {

            type: "select",

            name: "Exhibit Record Format",

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
                    .getAvailableFormats()
                    .map(format => ({

                        value: format,

                        label:
                            module.formatToLabel(
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

                return [
                    "F",
                    "O",
                    "F,O",
                    "O,F"

                ].map(format => ({

                    value: format,

                    label:
                        format
                            .split(",")
                            .map(key =>
                                this.reportFields[key].label
                            )
                            .join(" | ")

                }));

            }

        },


        enableGenericTitles: {

            type: "checkbox",

            name:
                "Enable generic page titles",

            description:
                "Replace generic Forensic Register page titles with useful page names.",

            default:
                true

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


    getFieldLabel(key) {

        return this.fields[key]?.label || key;

    },


    getFieldValue(key) {

        switch (key) {

            case "P":

                return this.getPropertyItemId();


            case "F":

                return this.getForensicNumber();


            case "O":

                return this.getOperationName();


            default:

                return "";

        }

    },


    getAvailableFormats() {

        const keys =
            Object.keys(this.fields);


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


            remaining.forEach(
                (key, index) => {


                    permute(

                        [
                            ...current,
                            key
                        ],

                        remaining.filter(
                            (_, i) =>
                                i !== index
                        )

                    );


                }
            );


        };


        permute(
            [],
            keys
        );


        return results;

    },


    formatToLabel(format) {

        return format
            .split(",")
            .map(key =>
                this.getFieldLabel(key)
            )
            .join(" | ");

    },


    getCurrentPageTitle() {

        const path =
            location.pathname
                .split("/")
                .pop();


        return this.pageTitles[path]
            || "";

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


    updateTitle() {


        let title = "";



        /*
            Priority 1:
            Exhibit custom titles
        */

        if (
            this.isExhibitPage()
        ) {


            const format =
                FRTools.Settings.getModuleOption(
                    this.id,
                    "exhibitFormat"
                );


            title =
                format
                    .split(",")
                    .map(key =>
                        this.getFieldValue(key)
                    )
                    .filter(Boolean)
                    .join(" | ");


        }



        /*
            Priority 2:
            Report custom titles
        */

        else if (
            this.isReportPage()
        ) {


            const format =
                FRTools.Settings.getModuleOption(
                    this.id,
                    "reportFormat"
                );


            title =
                format
                    .split(",")
                    .map(key =>
                        this.getFieldValue(key)
                    )
                    .filter(Boolean)
                    .join(" | ");


        }



        /*
            Priority 3:
            Generic friendly titles
        */

        else if (

            FRTools.Settings.getModuleOption(
                this.id,
                "enableGenericTitles"
            )

        ) {


            title =
                this.getCurrentPageTitle();


        }



        if (
            title &&
            document.title !== title
        ) {

            document.title =
                title;

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
            Refresh title when settings change
        */

        const controls =
            document.querySelectorAll(
                '[data-module-option="tabtitles"]'
            );


        controls.forEach(control => {


            control.addEventListener(
                "change",
                () => {

                    this.updateTitle();

                }
            );


        });


    },


    destroy() {


        if (this.titleObserver) {

            this.titleObserver.disconnect();

            this.titleObserver = null;

        }



        console.log(
            "[FR Tools] Tab Titles stopped"
        );


    }


});