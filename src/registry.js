(function () {
    "use strict";

    const modules = {};

    const FRTools = window.FRTools;

    if (!FRTools) {
        console.error("[FR Tools] Core not loaded.");
        return;
    }


    FRTools.Module = {

        register(module) {

            if (!module || typeof module !== "object") {
                console.error("[FR Tools] Invalid module.");
                return false;
            }


            if (!module.id) {
                console.error("[FR Tools] Module missing id.");
                return false;
            }


            if (modules[module.id]) {
                console.error(
                    `[FR Tools] Module "${module.id}" already registered.`
                );

                return false;
            }


            modules[module.id] = module;

            console.log(
                `[FR Tools] Registered module: ${module.id}`
            );

            return true;
        },


        get(id) {
            return modules[id];
        },


        all() {
            return Object.values(modules);
        },

        initAll() {

        Object.values(modules).forEach(module => {

        if (
            typeof module.init === "function" &&
            module.enabledByDefault !== false
        ) {

            console.log(
                `[FR Tools] Starting module: ${module.id}`
            );

            module.init();

        }

    });

}

    };

})();