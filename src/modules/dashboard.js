const Dashboard = {

    id: "dashboard",
    name: "Dashboard",

    init() {

        if (!location.pathname.includes("unit_worklist")) {
            return;
        }

        console.log("[FR Tools] Dashboard: Unit Worklist detected");

    }

};

FRTools.registerModule(Dashboard);