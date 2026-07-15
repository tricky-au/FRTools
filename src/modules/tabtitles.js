FRTools.Module.register({

    id: "tabtitles",
    name: "Tab Titles",
    description:
        "Customise browser tab titles for better visibility of what page you're on.",
    version: "1.2.0",
    enabledByDefault: true,

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


    pageTitles: {

        "personal_worklist.cfm":
            "Personal Worklist",

        "unit_worklist.cfm":
            "Unit Worklist",

        "exhibit_record_move.cfm":
            "Move Exhibit",

        "exhibit_record_transfer.cfm":
            "Transfer Exhibit",

        "exhibit_record.cfm":
            "Exhibit Record",

        "report_record.cfm":
            "Report Record",

        "exam_record.cfm":
            "Examination Record"

    },


    options: {

        exhibitFormat: {

            type: "select",

            name:
                "Exhibit Record Format",

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
                    .getFormats([
                        "P",
                        "F",
                        "O"
                    ])
                    .map(format => ({

                        value: format,

                        label:
                            module.getLabels(
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

                const module =
                    FRTools.Module.get(
                        "tabtitles"
                    );

                return module
                    .getFormats([
                        "F",
                        "O"
                    ])
                    .map(format => ({

                        value: format,

                        label:
                            module.getLabels(
                                format
                            )

                    }));

            }

        },


        examinationFormat: {

            type: "select",

            name:
                "Examination Record Format",

            description:
                "Choose how examination record tab titles are displayed.",

            default:
                "P,F,O",

            values() {

                const module =
                    FRTools.Module.get(
                        "tabtitles"
                    );

                return module
                    .getFormats([
                        "P",
                        "F",
                        "O"
                    ])
                    .map(format => ({

                        value: format,

                        label:
                            module.getLabels(
                                format
                            )

                    }));

            }

        },


        enableGenericTitles: {

            type: "checkbox",

            name:
                "Enable Generic Page Titles",

            description:
                "Replace generic Forensic Register page titles with useful page names.",

            default: true

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


    getExaminationPropertyItemId() {

        const match =
            document.querySelector(
                "#exhibitsExaminedTable td.fr_width_1-5"
            );


        if (match) {

            const lines =
                match.innerText
                    .trim()
                    .split("\n")
                    .map(v => v.trim())
                    .filter(Boolean);


            if (lines.length > 1) {

                const reference =
                    lines[1];

                this.cacheExamReference(
                    reference
                );

                return reference;

            }

        }


        /*
            Edit page:
            the PALM reference
            isn't present, so use
            the cached value.
        */

        return this.getCachedExamReference();

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


    getExaminationId() {

    return new URLSearchParams(
        location.search
    ).get("ExaminationID") || "";

    },


    cacheExamReference(reference) {

        const examId =
            this.getExaminationId();

        if (
            examId &&
            reference
        ) {

            FRTools.Storage.set(
                `examReference_${examId}`,
                reference
            );

        }

    },


    getCachedExamReference() {

        const examId =
            this.getExaminationId();

        if (!examId) {

            return "";

        }

        return FRTools.Storage.get(
            `examReference_${examId}`,
            ""
        );

    },

    getFieldValue(key) {

        switch (key) {

            case "P":

                if (this.isExaminationPage()) {

                    return this.getExaminationPropertyItemId();

                }

                return this.getPropertyItemId();


            case "F":

                return this.getForensicNumber();


            case "O":

                return this.getOperationName();


            default:

                return "";

        }

    },


    getFormats(keys) {

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


            remaining.forEach((key, index) => {

                permute(

                    [...current, key],

                    remaining.filter(
                        (_, i) => i !== index
                    )

                );

            });

        };


        permute([], keys);

        return results;

    },


    getLabels(format) {

        return format

            .split(",")

            .map(key =>
                this.fields[key].label
            )

            .join(" | ");

    },


    getFormattedTitle(format) {

        return format

            .split(",")

            .map(key =>
                this.getFieldValue(key)
            )

            .filter(Boolean)

            .join(" | ");

    },


    getCurrentPageTitle() {

        const file =

            location.pathname

                .split("/")

                .pop();


        if (

            this.pageTitles[file]

        ) {

            return this.pageTitles[file];

        }


        return file

            .replace(".cfm", "")

            .replaceAll("_", " ")

            .replace(/\b\w/g, c =>
                c.toUpperCase()
            );

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


    isExaminationPage() {

        return location.pathname.includes(

            "/main/exam/exam_record.cfm"

        );

    },


    updateTitle() {

        let title = "";


        if (

            this.isExhibitPage()

        ) {

            title = this.getFormattedTitle(

                FRTools.Settings.getModuleOption(

                    this.id,

                    "exhibitFormat"

                )

            );

        }

        else if (

            this.isReportPage()

        ) {

            title = this.getFormattedTitle(

                FRTools.Settings.getModuleOption(

                    this.id,

                    "reportFormat"

                )

            );

        }

        else if (

            this.isExaminationPage()

        ) {

            title = this.getFormattedTitle(

                FRTools.Settings.getModuleOption(

                    this.id,

                    "examinationFormat"

                )

            );

        }

        else if (

            FRTools.Settings.getModuleOption(

                this.id,

                "enableGenericTitles"

            )

        ) {

            title = this.getCurrentPageTitle();

        }


        if (

            title &&

            document.title !== title

        ) {

            document.title = title;

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
            Refresh title immediately
            when settings change.
        */

        document.addEventListener(

            "change",

            event => {

                if (

                    event.target.matches(

                        '[data-module-option="tabtitles"]'

                    )

                ) {

                    this.updateTitle();

                }

            }

        );

    },


    destroy() {

        if (

            this.titleObserver

        ) {

            this.titleObserver.disconnect();

            this.titleObserver = null;

        }


        console.log(

            "[FR Tools] Tab Titles stopped"

        );

    }

});