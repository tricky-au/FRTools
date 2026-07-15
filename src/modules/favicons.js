FRTools.Module.register({

    id: "favicons",
    name: "Dynamic Favicons",
    description:
        "Replace page favicons with icons based on the current page.",
    version: "1.2.0",
    enabledByDefault: true,


    options: {

        enabled: {

            type: "checkbox",

            name:
                "Enable Dynamic Favicons",

            description:
                "Replace the default favicon with page-specific icons.",

            default: true

        }

    },


    pageIcons: {

        "exhibit_record.cfm": {

            icon: "phone",

            colour: "#1976d2"

        },


        "report_record.cfm": {

            icon: "document",

            colour: "#43a047"

        },


        "exam_record.cfm": {

            icon: "microscope",

            colour: "#8e24aa"

        },


        "personal_worklist.cfm": {

            icon: "clipboard",

            colour: "#fb8c00"

        },


        "unit_worklist.cfm": {

            icon: "clipboard",

            colour: "#fb8c00"

        }

    },


    matches() {

        return true;

    },


    init() {

        console.log(
            "[FR Tools] Dynamic Favicons loaded"
        );


        this.updateFavicon();

    },


    getCurrentPage() {

        return location.pathname
            .split("/")
            .pop();

    },


    getCurrentIcon() {

        return this.pageIcons[
            this.getCurrentPage()
        ] || null;

    },


    getBackground(colour) {

        return `

<rect
    width="64"
    height="64"
    rx="14"
    fill="${colour}"/>

`;

    },

    getSymbol(icon) {

        switch (icon) {


            case "phone":

                return `

<rect
    x="18"
    y="8"
    width="28"
    height="48"
    rx="5"
    fill="white"/>


<rect
    x="22"
    y="13"
    width="20"
    height="31"
    rx="2"
    fill="#1976d2"/>


<circle
    cx="32"
    cy="49"
    r="2"
    fill="#1976d2"/>

`;


            case "document":

                return `

<path
    d="M20 10
       H38
       L46 18
       V54
       H20
       Z"
    fill="white"/>


<path
    d="M38 10
       V18
       H46"
    fill="#43a047"/>


<rect
    x="26"
    y="28"
    width="14"
    height="2"
    fill="#43a047"/>


<rect
    x="26"
    y="34"
    width="14"
    height="2"
    fill="#43a047"/>


<rect
    x="26"
    y="40"
    width="10"
    height="2"
    fill="#43a047"/>

`;


            case "microscope":

                return `

<path
    d="M25 46
       H43"
    stroke="white"
    stroke-width="4"
    stroke-linecap="round"/>


<path
    d="M31 42
       C31 34 39 34 39 25"
    stroke="white"
    stroke-width="4"
    fill="none"
    stroke-linecap="round"/>


<circle
    cx="39"
    cy="20"
    r="4"
    fill="white"/>


<path
    d="M23 52
       H45"
    stroke="white"
    stroke-width="4"
    stroke-linecap="round"/>


<path
    d="M27 46
       C27 40 31 37 37 37"
    stroke="white"
    stroke-width="4"
    fill="none"
    stroke-linecap="round"/>

`;


            case "clipboard":

                return `

<rect
    x="18"
    y="12"
    width="28"
    height="40"
    rx="3"
    fill="white"/>


<rect
    x="26"
    y="8"
    width="12"
    height="8"
    rx="2"
    fill="white"/>


<rect
    x="24"
    y="24"
    width="16"
    height="2"
    fill="#fb8c00"/>


<rect
    x="24"
    y="31"
    width="16"
    height="2"
    fill="#fb8c00"/>


<rect
    x="24"
    y="38"
    width="12"
    height="2"
    fill="#fb8c00"/>

`;


            default:

                return "";

        }

    },

    buildSvg(icon, colour) {

        return `

<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64">

${this.getBackground(colour)}

${this.getSymbol(icon)}

</svg>

`;

    },


    setFavicon(svg) {

        const favicon =

            "data:image/svg+xml," +

            encodeURIComponent(svg);


        let link =

            document.querySelector(
                "link[rel*='icon']"
            );


        if (!link) {

            link =
                document.createElement(
                    "link"
                );


            link.rel =
                "icon";


            document.head.appendChild(
                link
            );

        }


        link.href =
            favicon;

    },


    updateFavicon() {


        if (

            !FRTools.Settings.getModuleOption(

                this.id,

                "enabled"

            )

        ) {

            return;

        }


        const page =
            this.getCurrentIcon();


        if (!page) {

            return;

        }


        console.log(

            `[FR Tools] Setting ${page.icon} favicon`

        );


        const svg =

            this.buildSvg(

                page.icon,

                page.colour

            );


        this.setFavicon(svg);

    },


    destroy() {

        console.log(
            "[FR Tools] Dynamic Favicons stopped"
        );

    }

});
