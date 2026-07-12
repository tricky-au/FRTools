FRTools.Module.register({

    id: "autoexpand",

    name: "Auto Expand",

    description: "Automatically expands hidden sections.",

    version: "1.0.0",

    author: "FR Tools",

    enabledByDefault: true,


    init() {

        console.log(
            "[FR Tools] Auto Expand loaded"
        );

    },


    destroy() {

        console.log(
            "[FR Tools] Auto Expand stopped"
        );

    }

});