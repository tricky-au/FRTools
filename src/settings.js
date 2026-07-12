FRTools.Settings = {

    getModuleState(id, defaultValue = true) {

        const key = `module_${id}_enabled`;

        return FRTools.Storage.get(
            key,
            defaultValue
        );

    },


    setModuleState(id, enabled) {

        const key = `module_${id}_enabled`;

        FRTools.Storage.set(
            key,
            enabled
        );

    },


    getModuleOption(id, option) {

        const module =
            FRTools.Module.get(id);


        if (
            !module ||
            !module.options ||
            !module.options[option]
        ) {

            console.warn(
                `[FR Tools] Unknown module option: ${id}.${option}`
            );

            return undefined;

        }


        const key =
            `module_${id}_option_${option}`;


        return FRTools.Storage.get(
            key,
            module.options[option].default ?? false
        );

    },


    setModuleOption(id, option, value) {

        const key =
            `module_${id}_option_${option}`;


        FRTools.Storage.set(
            key,
            value
        );

    },


    exportSettings() {

        const settings = {

            version: 1,

            modules: {},

            options: {}

        };


        FRTools.Module.all().forEach(module => {

            settings.modules[module.id] =
                this.getModuleState(
                    module.id,
                    module.enabledByDefault !== false
                );


            if (module.options) {

                settings.options[module.id] = {};


                Object.keys(module.options)
                    .forEach(option => {

                        settings.options[module.id][option] =
                            this.getModuleOption(
                                module.id,
                                option
                            );

                    });

            }

        });


        return JSON.stringify(
            settings,
            null,
            2
        );

    },


    importSettings(json) {

        const settings =
            JSON.parse(json);


        if (!settings.modules) {

            throw new Error(
                "Invalid settings file."
            );

        }


        Object.entries(settings.modules)
            .forEach(([id, enabled]) => {

                this.setModuleState(
                    id,
                    enabled
                );

            });


        if (settings.options) {

            Object.entries(settings.options)
                .forEach(([id, options]) => {

                    Object.entries(options)
                        .forEach(([option, value]) => {

                            this.setModuleOption(
                                id,
                                option,
                                value
                            );

                        });

                });

        }

    },


    resetSettings() {

        FRTools.Module.all().forEach(module => {

            this.setModuleState(
                module.id,
                module.enabledByDefault !== false
            );


            if (module.options) {

                Object.keys(module.options)
                    .forEach(option => {

                        this.setModuleOption(
                            module.id,
                            option,
                            module.options[option].default ?? false
                        );

                    });

            }

        });

    }

};