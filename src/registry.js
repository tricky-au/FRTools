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

                const enabled =
                    FRTools.Settings.getModuleState(
                        module.id,
                        module.enabledByDefault !== false
                    );


                if (!enabled) {

                    console.log(
                        `[FR Tools] Disabled module: ${module.id}`
                    );

                    return;

                }


                if (
                    typeof module.matches === "function" &&
                    !module.matches(window.location)
                ) {

                    console.log(
                        `[FR Tools] Skipping module (page mismatch): ${module.id}`
                    );

                    return;

                }


                if (
                    typeof module.init === "function"
                ) {

                    console.log(
                        `[FR Tools] Starting module: ${module.id}`
                    );

                    module.init();

                }

            });

        },


        enable(id) {

            const module = this.get(id);


            if (!module) {

                console.error(
                    `[FR Tools] Module not found: ${id}`
                );

                return;

            }


            FRTools.Settings.setModuleState(
                id,
                true
            );


            if (
                typeof module.init === "function"
            ) {

                console.log(
                    `[FR Tools] Starting module: ${module.name}`
                );


                module.init();

            }


            FRTools.GUI.notify(
                `${module.name} enabled`
            );

        },


        disable(id) {

            const module = this.get(id);


            if (!module) {

                console.error(
                    `[FR Tools] Module not found: ${id}`
                );

                return;

            }


            FRTools.Settings.setModuleState(
                id,
                false
            );


            if (
                typeof module.destroy === "function"
            ) {

                console.log(
                    `[FR Tools] Stopping module: ${module.name}`
                );


                module.destroy();

            }


            FRTools.GUI.notify(
                `${module.name} disabled`
            );

        }

    };

})();