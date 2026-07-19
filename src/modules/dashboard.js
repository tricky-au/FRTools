FRTools.Module.register({

    id: "dashboard",
    name: "Dashboard",
    description: "Unit Worklist dashboard.",
    version: "1.0.0",
    enabledByDefault: true,

    matches(location) {

        return (
            location.pathname.includes(
                "/main/worklists/unit_worklist.cfm"
            )
        );

    },

    init() {

        console.log(
            "[FR Tools] Dashboard loaded"
        );

    }

});