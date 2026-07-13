FRTools.Module.register({

    id: "favicons",

    name: "Dynamic Favicons",

    description:
        "Replace page favicons with icons based on the current page.",

    version: "1.0.0",

    enabledByDefault: false,


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


    matches() {

        return true;

    },


    init() {

        console.log(
            "[FR Tools] Dynamic Favicons loaded"
        );


        this.updateFavicon();

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


        /*
            Test only on Exhibit Record pages.
        */

        if (

            !location.pathname.includes(

                "/main/exhibit/exhibit_record.cfm"

            )

        ) {

            return;

        }


        console.log(

            "[FR Tools] Setting test favicon"

        );


const svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 64 64">

    <rect
        x="18"
        y="6"
        width="28"
        height="52"
        rx="5"
        fill="#1976d2"/>

    <rect
        x="22"
        y="12"
        width="20"
        height="36"
        rx="2"
        fill="white"/>

    <circle
        cx="32"
        cy="53"
        r="2.5"
        fill="white"/>

</svg>`;


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


    destroy() {

        console.log(
            "[FR Tools] Dynamic Favicons stopped"
        );

    }

});