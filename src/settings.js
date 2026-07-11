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

    }

};