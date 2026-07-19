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

        const jobs = this.getJobs();

        console.log(
            `[FR Tools] Dashboard found ${jobs.length} jobs`
        );

    },

    getTable() {

        return jQuery("#UnitWorklistTable").DataTable();

    },

    getJobs() {

        return this
            .getTable()
            .rows()
            .data()
            .toArray();

    },

});