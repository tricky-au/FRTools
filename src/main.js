(function () {
    "use strict";

    console.log("[FR Tools] Starting...");
    console.log(
        "[FR Tools] Registered Modules:",
        FRTools.Module.all()
    );

    FRTools.Module.initAll();

    FRTools.init();

})();