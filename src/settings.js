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

    exportSettings() {

    const settings = {

        version: 1,

        modules: {}

    };


    FRTools.Module.all().forEach(module => {

        settings.modules[module.id] =
            this.getModuleState(
                module.id,
                module.enabledByDefault !== false
            );

    });


    return JSON.stringify(
        settings,
        null,
        2
    );

},


importSettings(json) {

    const settings = JSON.parse(json);


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

},


resetSettings() {

    FRTools.Module.all().forEach(module => {

        this.setModuleState(
            module.id,
            module.enabledByDefault !== false
        );

    });

}

};