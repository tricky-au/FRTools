(function () {
    'use strict';


    const FRTools = {

        Version: "__VERSION__",

        Module: {},

        Storage: {},

        Settings: {},

        Events: {},

        GUI: {},

        Utils: {},

        state: {
            uiOpen: false,
            uiInitialized: false
        }

    };


    window.FRTools = FRTools;

    if (typeof unsafeWindow !== "undefined") {

        unsafeWindow.FRTools = FRTools;

    }


    //
    // Storage
    //

    FRTools.Storage = {

        get(key, fallback) {

            const val = GM_getValue(key);

            return val === undefined
                ? fallback
                : val;

        },


        set(key, value) {

            GM_setValue(
                key,
                value
            );

        }

    };


    //
    // Startup
    //

    function start() {

        console.log("[FR Tools] Starting");


        //
        // Start Modules
        //

        if (
            FRTools.Module &&
            typeof FRTools.Module.initAll === "function"
        ) {

            FRTools.Module.initAll();

        }


        //
        // Start GUI
        //

        if (
            FRTools.GUI &&
            typeof FRTools.GUI.init === "function"
        ) {

            FRTools.GUI.init();

        }


        console.log("[FR Tools] Core loaded");

    }


    function waitForBody() {

        if (document.body) {

            start();

        }
        else {

            const obs = new MutationObserver(() => {

                if (document.body) {

                    obs.disconnect();

                    start();

                }

            });


            obs.observe(
                document.documentElement,
                {
                    childList: true,
                    subtree: true
                }
            );

        }

    }


    FRTools.init = function () {

        waitForBody();

    };


})();