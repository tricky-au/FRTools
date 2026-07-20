FRTools.Module.register({
    stats: null,
    chart: null,
    offenceChart: null,

    id: "dashboard",

    name: "Dashboard",

    description: "Unit Worklist dashboard.",

    version: "1.0.0",

    enabledByDefault: true,
   
    overlayId:
        "frtools-dashboard-overlay",

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

    this.addStyles();

    this.createButton();

},




    addStyles() {


        GM_addStyle(`


            #frtools-dashboard-button {


                position: fixed;

                bottom: 75px;

                right: 20px;

                z-index: 999999;


                background:
                    rgb(26,38,50);


                color:
                    white;


                border:
                    none;


                border-radius:
                    8px;


                padding:
                    12px 18px;


                font-size:
                    14px;


                font-weight:
                    600;


                cursor:
                    pointer;


                box-shadow:
                    0 4px 14px rgba(0,0,0,0.3);


                transition:
                    transform 0.2s ease,
                    box-shadow 0.2s ease;


            }




            #frtools-dashboard-button:hover {


                transform:
                    translateY(-2px);


                box-shadow:
                    0 6px 18px rgba(0,0,0,0.35);


            }




            #frtools-dashboard-overlay {


                position:
                    fixed;


                inset:
                    0;


                background:
                    rgba(0,0,0,0.45);


                z-index:
                    999998;


                display:
                    none;


                align-items:
                    center;


                justify-content:
                    center;


            }




            #frtools-dashboard-modal {


                width:
                    1100px;


                max-width:
                    95vw;


                max-height:
                    80vh;


                overflow:
                    auto;


                background:
                    white;


                border-radius:
                    12px;


                box-shadow:
                    0 12px 35px rgba(0,0,0,0.45);


            }




.frtools-dashboard-header {

    background:
        rgb(26,38,50);

    color:
        white;

    text-align:
        center;

    padding:
        16px 20px;

    font-size:
        18px;

    font-weight:
        700;

    border-radius:
        12px 12px 0 0;

    position:
        relative;

}


#frtools-dashboard-export {

    position:
        absolute;

    right:
        12px;

    top:
        50%;

    transform:
        translateY(-50%);


    background:
        white;

    color:
        rgb(26,38,50);


    border:
        none;


    border-radius:
        5px;


    padding:
        4px 8px;


    font-size:
        11px;


    font-weight:
        700;


    cursor:
        pointer;


}


#frtools-dashboard-export:hover {

    opacity:
        0.85;

}



            .frtools-dashboard-content {

                padding: 12px;

                font-size: 13px;

                overflow-y: auto;

                flex: 1;

            }

.frtools-dashboard-columns {

    display:
        grid;

    grid-template-columns:
        1fr 1fr;

    gap:
        10px;

    width:
        100%;

}


            .frtools-dashboard-column {

                min-width: 0;

            }


.frtools-chart-container {

    position: relative;

    height: 350px;

    width: 100%;

}


.frtools-dashboard-row {

    display:
        flex;

    justify-content:
        space-between;

    align-items:
        center;

    padding:
        2px 6px;

    margin:
        0;

    line-height:
        1.2;

    font-size:
        13px;

}


            .frtools-dashboard-row:last-child {

                border-bottom:
                    none;

            }

            .frtools-dashboard-content::-webkit-scrollbar {

                width: 10px;

            }

            .frtools-dashboard-content::-webkit-scrollbar-track {

                background: #ebebeb;

                border-radius: 10px;

            }

            .frtools-dashboard-content::-webkit-scrollbar-thumb {

                background: rgb(26,38,50);

                border-radius: 10px;

                border: 2px solid #ebebeb;

            }

            .frtools-dashboard-content::-webkit-scrollbar-thumb:hover {

                background: #263746;

            }

            .frtools-dashboard-card {


                background:
                    rgb(235,235,235);


                border:
                    1px solid #ccc;


                border-radius:
                    8px;


                padding:
                    10px;


                margin-bottom:
                    12px;


            }

.frtools-dashboard-tabs {

    display:
        flex;

    border-bottom:
        1px solid #ccc;

}


.frtools-dashboard-tab {

    flex:
        1;

    padding:
        10px;

    border:
        none;

    background:
        #eee;

    cursor:
        pointer;

    font-weight:
        600;

}


.frtools-dashboard-tab.active {

    background:
        white;

    border-bottom:
        3px solid rgb(26,38,50);

}


.frtools-dashboard-tab:hover {

    background:
        #ddd;

}

        `);


    },

    createButton() {


        if (
            document.getElementById(
                "frtools-dashboard-button"
            )
        ) {

            return;

        }



        const button =
            document.createElement(
                "button"
            );


        button.id =
            "frtools-dashboard-button";


        button.textContent =
            "Dashboard";



        button.addEventListener(
            "click",
            () => {

                this.openDashboard();

            }
        );



        document.body.appendChild(
            button
        );


    },



    openDashboard() {

    if (
        !this.matches(window.location)
    ) {

        FRTools.GUI.notify(
            "Dashboard is only available on the Unit Worklist."
        );

        return;

    }
        let overlay =
            document.getElementById(
                this.overlayId
            );


        if (!overlay) {


            overlay =
                document.createElement(
                    "div"
                );


            overlay.id =
                this.overlayId;



            overlay.innerHTML = `

                <div id="frtools-dashboard-modal">


                    <div class="frtools-dashboard-header">

                        FR Tools Dashboard

                    </div>


                    <div class="frtools-dashboard-tabs">

                        <button 
                            class="frtools-dashboard-tab active"
                            data-tab="overview">
                            Overview
                        </button>


                        <button 
                            class="frtools-dashboard-tab"
                            data-tab="analytics">
                            Analytics
                        </button>


                    </div>


                    <div 
                        id="frtools-dashboard-overview"
                        class="frtools-dashboard-content">

                    </div>


                    <div 
                        id="frtools-dashboard-analytics"
                        class="frtools-dashboard-content"
                        style="display:none;">


                        <div class="frtools-dashboard-section">


                            <div class="frtools-dashboard-section-title">

                                Exhibit Categories

                            </div>


                            <div class="frtools-chart-container">

                                <canvas 
                                    id="frtools-exhibit-category-chart">
                                </canvas>

                            </div>


                        </div>

                        <div class="frtools-dashboard-section">

                        <div class="frtools-dashboard-section-title">

                            Forensic Offence Categories

                        </div>


                        <div class="frtools-chart-container">

                            <canvas 
                                id="frtools-offence-category-chart">
                            </canvas>

                        </div>

                    </div>


                    </div>


                </div>


            `;



            document.body.appendChild(
                overlay
            );


overlay
.querySelectorAll(
    ".frtools-dashboard-tab"
)
.forEach(tab => {


    tab.addEventListener(
        "click",
        () => {


            overlay
            .querySelectorAll(
                ".frtools-dashboard-tab"
            )
            .forEach(button => {

                button.classList.remove(
                    "active"
                );

            });


            tab.classList.add(
                "active"
            );


            const selected =
                tab.dataset.tab;


            document
            .getElementById(
                "frtools-dashboard-overview"
            )
            .style.display =
                selected === "overview"
                    ? "block"
                    : "none";


            document
            .getElementById(
                "frtools-dashboard-analytics"
            )
            .style.display =
                selected === "analytics"
                    ? "block"
                    : "none";

            if (
                selected === "analytics"
            ) {

                this.loadChartLibrary();

            }
        }
    );


});

            overlay.addEventListener(
                "click",
                event => {


                    if (
                        event.target === overlay
                    ) {

                        this.closeDashboard();

                    }


                }
            );




            document
                .getElementById(
                    "frtools-dashboard-export"
                )

        }


const jobs =
    this.getJobs();


const stats =
    this.getStats(
        jobs
    );

    this.stats =
    stats;

    console.log(
    "[FR Tools] Dashboard Stats Snapshot",
);

document
.getElementById(
    "frtools-dashboard-overview"
)
.innerHTML = `

<div class="frtools-dashboard-grid">

    <div class="frtools-dashboard-card">

        <div class="frtools-dashboard-card-title">
            Requests
        </div>

        <div class="frtools-dashboard-card-value">
            ${stats.summary.totalJobs}
        </div>

    </div>


    <div class="frtools-dashboard-card">

        <div class="frtools-dashboard-card-title">
            Assigned
        </div>

        <div class="frtools-dashboard-card-value">
            ${stats.summary.assigned}
        </div>

    </div>


    <div class="frtools-dashboard-card">

        <div class="frtools-dashboard-card-title">
            Queue
        </div>

        <div class="frtools-dashboard-card-value">
            ${stats.summary.queue}
        </div>

    </div>


    <div class="frtools-dashboard-card">

        <div class="frtools-dashboard-card-title">
            Issues
        </div>

        <div class="frtools-dashboard-card-value">
            ${stats.summary.problems}
        </div>

    </div>

    <div class="frtools-dashboard-card">

        <div class="frtools-dashboard-card-title">
            Average Request Age
        </div>

        <div class="frtools-dashboard-card-value">
            ${stats.summary.averageAge}
        </div>

    </div>


    <div class="frtools-dashboard-card">

    <div class="frtools-dashboard-card-title">
        Oldest Unassigned Request #
    </div>

    <div class="frtools-dashboard-card-value">

        ${stats.oldestUnassigned.reportNo}

    </div>

    <div style="font-size:12px; margin-top:8px;">

        ${stats.oldestUnassigned.date}

    </div>

    </div>

    <div class="frtools-dashboard-card">

    <div class="frtools-dashboard-card-title">
        Oldest Active Request #
    </div>


    <div class="frtools-dashboard-card-value">

        ${stats.oldestActive.reportNo}

    </div>


    <div style="font-size:12px; margin-top:8px;">

        ${stats.oldestActive.date}

    </div>

    </div>

    <div class="frtools-dashboard-card">

    <div class="frtools-dashboard-card-title">
        Examination Complete
    </div>

    <div class="frtools-dashboard-card-value">
        ${stats.summary.examComplete}
    </div>

    </div>


</div>



<div class="frtools-dashboard-columns">


    <!-- LEFT COLUMN -->

    <div class="frtools-dashboard-column">


        ${this.renderStatSection(
            "Status Overview",
            {
                "🟢 Assigned": stats.summary.assigned,
                "🟠 Queue": stats.summary.queue,
                "🔴 Issues": stats.summary.problems,
                "⚪ Complete": stats.summary.complete
            }
        )}

        ${this.renderStatSection(
            "Unallocated Queue Breakdown",
            {
                "Total Queue": stats.queue.total,
                "CAT A": stats.queue.catA,
                "CAT B": stats.queue.catB,
                "CAT C": stats.queue.catC
            }
        )}

        ${this.renderStatSection(
            "Total Backlog Breakdown",
            {
                "No Priority": stats.priorities.none,
                "CAT A": stats.priorities.catA,
                "CAT B": stats.priorities.catB,
                "CAT C": stats.priorities.catC
            }
        )}

        ${this.renderStatSection(
            "Examiner Workload",
            stats.examinerWorkload
            )}

        ${this.renderStatSection(
            "Request Age",
            stats.ageBuckets
        )}


        ${this.renderStatSection(
            "Exhibit Statistics",
            {
                "Total Exhibits": stats.summary.exhibitCount,
                "Average / Request": stats.summary.averageExhibits,
            }
        )}

        ${this.renderStatSection(
            "Capabilities",
            stats.capabilities
        )}


    </div>





    <!-- RIGHT COLUMN -->

    <div class="frtools-dashboard-column">


        ${this.renderStatSection(
            "Exhibit Categories",
            stats.categories
        )}



        ${this.renderStatSection(
            "Forensic Offence Categories",
            stats.offences
        )}


    </div>



</div>


`;



        overlay.style.display =
            "flex";



        document.addEventListener(
            "keydown",
            this.escapeHandler
        );


    },

    closeDashboard() {


        const overlay =
            document.getElementById(
                this.overlayId
            );


        if (!overlay) {

            return;

        }



        overlay.style.display =
            "none";



        document.removeEventListener(
            "keydown",
            this.escapeHandler
        );


    },

loadChartLibrary() {

    if (
        typeof Chart !== "undefined"
    ) {

        return;

    }


    const script =
        document.createElement(
            "script"
        );


    script.src =
        "https://cdn.jsdelivr.net/npm/chart.js";


    script.onload = () => {

        console.log(
            "[FR Tools] Chart.js loaded"
        );

        this.renderExhibitCategoryChart();

        this.renderOffenceCategoryChart();

    };


    document.head.appendChild(
        script
    );

},


renderExhibitCategoryChart() {


    if (
        !this.stats ||
        !this.stats.categories
    ) {

        return;

    }


    const canvas =
        document.getElementById(
            "frtools-exhibit-category-chart"
        );


    if (!canvas) {

        return;

    }


    if (
        this.chart
    ) {

        this.chart.destroy();

    }
    


    const labels =
        Object.keys(
            this.stats.categories
        );


    const values =
        Object.values(
            this.stats.categories
        );


    this.chart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels,

                    datasets: [{

                        label:
                            "Exhibits",

                        data:
                            values

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: false

                        }

                    }

                }

            }
        );


},

renderOffenceCategoryChart() {


    if (
        !this.stats ||
        !this.stats.offences
    ) {

        return;

    }


    const canvas =
        document.getElementById(
            "frtools-offence-category-chart"
        );


    if (!canvas) {

        return;

    }


    if (
        this.offenceChart
    ) {

        this.offenceChart.destroy();

    }


    const labels =
        Object.keys(
            this.stats.offences
        );


    const values =
        Object.values(
            this.stats.offences
        );


    this.offenceChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels,

                    datasets: [{

                        label:
                            "Requests",

                        data:
                            values

                    }]

                },

                options: {

                    indexAxis:
                        "y",

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        y: {

                            ticks: {

                                autoSkip: false

                            }

                        }

                    },

                    plugins: {

                        legend: {

                            display: false

                        }

                    }

                }

            }
        );


},


    renderStatSection(title, data) {

    return `

        <div class="frtools-dashboard-section">

            <div class="frtools-dashboard-section-title">

                ${title}

            </div>

            ${
                Object.entries(data)
                    .map(
                        ([name, value]) => `

                            <div class="frtools-dashboard-row">

                                <span>${name}</span>

                                <strong>${value}</strong>

                            </div>

                        `
                    )
                    .join("")
            }

        </div>

    `;

},

renderStatusOverview(stats) {

    return `

    <div class="frtools-dashboard-section">

        <div class="frtools-dashboard-section-title">

            Status Overview

        </div>


        <div class="frtools-dashboard-row">

            <span>🟢 Assigned</span>

            <strong>${stats.summary.assigned}</strong>

        </div>


        <div class="frtools-dashboard-row">

            <span>🟠 Queue</span>

            <strong>${stats.summary.queue}</strong>

        </div>


        <div class="frtools-dashboard-row">

            <span>🔴 Issues</span>

            <strong>${stats.summary.problems}</strong>

        </div>


        <div class="frtools-dashboard-row">

            <span>⚪ Complete</span>

            <strong>${stats.summary.complete}</strong>

        </div>


    </div>

    `;

},

renderPriorityBreakdown(stats) {

    return `

    <div class="frtools-dashboard-section">


        <div class="frtools-dashboard-section-title">

            Priority Breakdown

        </div>


        <div class="frtools-dashboard-row">

            <span>No Priority</span>

            <strong>
                ${stats.priorities.none}
            </strong>

        </div>


        <div class="frtools-dashboard-row">

            <span>Cat A</span>

            <strong>
                ${stats.priorities.catA}
            </strong>

        </div>


        <div class="frtools-dashboard-row">

            <span>Cat B</span>

            <strong>
                ${stats.priorities.catB}
            </strong>

        </div>


        <div class="frtools-dashboard-row">

            <span>Cat C</span>

            <strong>
                ${stats.priorities.catC}
            </strong>

        </div>


    </div>

    `;

},

    escapeHandler(event) {


        if (
            event.key === "Escape"
        ) {

            FRTools.Module
                .get("dashboard")
                .closeDashboard();

        }


    },

    getTable() {

        return jQuery(
            "#UnitWorklistTable"
        ).DataTable();

    },



    getJobs() {
console.count(
    "[FR Tools] getJobs called"
);
        return this
            .getTable()
            .rows()
            .data()
            .toArray();

    },



getStats(jobs) {

    jobs =
        jobs || this.getJobs();

    return {

        summary:
            this.getSummaryStats(
                jobs
            ),

        oldestUnassigned:
            this.getOldestUnassignedRequest(
                jobs
            ),

        oldestActive:
            this.getOldestActiveRequest(
                jobs
            ),

        priorities:
            this.getPriorityStats(
                jobs
            ),

        queue:
            this.getQueuePriorityStats(
                jobs
            ),

        capabilities:
            this.getCapabilityStats(
                jobs
            ),

        categories:
            this.getCategoryStats(
                jobs
            ),

        exhibits:
            this.getExhibitStats(
                jobs
            ),

        offences:
            this.getOffenceStats(
                jobs
            ),

        examinerWorkload:
            this.getExaminerWorkloadStats(
                jobs
            ),

        ageBuckets:
            this.getAgeBucketStats(
                jobs
            ),

    };

},

getSummaryStats(jobs) {

    let assigned = 0;
    let queue = 0;
    let problems = 0;
    let complete = 0;
    let examComplete = 0;
    let exhibitCount = 0;
    let totalAge = 0;

    jobs.forEach(job => {

    switch ((job.BACKGROUNDCOLOR || "").toLowerCase()) {

        case "green":
            assigned++;
            break;

        case "orange":
            queue++;
            break;

        case "red":
            problems++;
            break;

        case "grey":
            complete++;
            break;

    }


    if (Number(job.REQUESTSTATUS1) === 1) {

        examComplete++;

    }


    exhibitCount += Number(job.EXHIBITCOUNT || 0);


if (job.REPORTDATE) {


    const requestDate =
        new Date(
            job.REPORTDATE
                .replace(
                    " +00:00",
                    "Z"
                )
                .replace(
                    " ",
                    "T"
                )
        );


    if (!isNaN(requestDate)) {


        const today =
            new Date();


        const age =
            Math.floor(
                (
                    today - requestDate
                )
                /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        if (age >= 0) {

            totalAge += age;

        }


    }


}


});

    return {

        totalJobs: jobs.length,

        assigned,

        queue,

        problems,

        complete,

        examComplete,

        exhibitCount,

        averageExhibits:
            jobs.length
                ? (exhibitCount / jobs.length).toFixed(2)
                : "0.00",

        averageAge:
            jobs.length
                ? Math.round(totalAge / jobs.length)
                : 0,

    };

},


getOldestUnassignedRequest(jobs) {

    let oldest = null;


    jobs.forEach(job => {


        const status =
            (job.BACKGROUNDCOLOR || "")
                .toLowerCase();


        if (status !== "orange") {

            return;

        }


        if (!job.REPORTDATE) {

            return;

        }


        const reportDate =
            new Date(
                job.REPORTDATE
                    .replace(
                        " +00:00",
                        "Z"
                    )
                    .replace(
                        " ",
                        "T"
                    )
            );


        if (isNaN(reportDate)) {

            return;

        }


        if (
            !oldest ||
            reportDate < oldest.date
        ) {


            oldest = {

                reportNo:
                    job.REPORTNO,

                date:
                    reportDate

            };


        }


    });


    if (!oldest) {

        return {

            reportNo:
                "None",

            date:
                "N/A"

        };

    }


    return {

        reportNo:
            oldest.reportNo,

        date:
            oldest.date.toLocaleDateString(
                "en-AU",
                {
                    timeZone:
                        "Australia/Melbourne"
                }
            )

    };


},

getOldestActiveRequest(jobs) {

    let oldest = null;


    jobs.forEach(job => {


        const status =
            (job.BACKGROUNDCOLOR || "")
                .toLowerCase();


        // Ignore completed requests
        if (status === "grey") {

            return;

        }


        if (!job.REPORTDATE) {

            return;

        }


        const reportDate =
            new Date(
                job.REPORTDATE
                    .replace(
                        " +00:00",
                        "Z"
                    )
                    .replace(
                        " ",
                        "T"
                    )
            );


        if (isNaN(reportDate)) {

            return;

        }


        if (
            !oldest ||
            reportDate < oldest.date
        ) {


            oldest = {

                reportNo:
                    job.REPORTNO,

                date:
                    reportDate,

                status:
                    status

            };


        }


    });



    if (!oldest) {

        return {

            reportNo:
                "None",

            date:
                "N/A",

            status:
                ""

        };

    }



    return {

        reportNo:
            oldest.reportNo,


        date:
            oldest.date.toLocaleDateString(
                "en-AU",
                {
                    timeZone:
                        "Australia/Melbourne"
                }
            ),


        status:
            oldest.status

    };


},

getPriorityStats(jobs) {

    const priorities = {

        none: 0,

        catA: 0,

        catB: 0,

        catC: 0

    };


    jobs.forEach(job => {

        switch (
            Number(job.PRIORITY)
        ) {

            case 6:

                priorities.catA++;

                break;

            case 4:

                priorities.catB++;

                break;

            case 2:

                priorities.catC++;

                break;

            default:

                priorities.none++;

                break;

        }

    });


    return priorities;

},

getCapabilityStats(jobs) {

    const capabilities = {};


    jobs.forEach(job => {


        const capabilityCSV =
            job.CAPABILITIESCSV || "";


        if (!capabilityCSV.trim()) {

            return;

        }


        capabilityCSV
            .split(",")
            .forEach(item => {


                const capability =
                    item.trim();


                if (!capability) {

                    return;

                }


                capabilities[capability] =
                    (capabilities[capability] || 0) + 1;


            });


    });


    return Object.fromEntries(

        Object.entries(capabilities)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )

    );


},

getCategoryStats(jobs) {

    const categories = {};

    jobs.forEach(job => {

        if (!job.ATTACHEDEXHIBITS) {

            return;

        }

        try {

            const exhibits =
                JSON.parse(job.ATTACHEDEXHIBITS);

            exhibits.forEach(exhibit => {

                const category =
                    (exhibit.CategoryName || "Unknown").trim();

                categories[category] =
                    (categories[category] || 0) + 1;

            });

        }
        catch {

            // Ignore malformed exhibit JSON

        }

    });

    return Object
        .entries(categories)
        .sort(
            (a, b) => b[1] - a[1]
        )
        .reduce(
            (obj, [name, count]) => {

                obj[name] = count;

                return obj;

            },
            {}
        );

},


getOffenceStats(jobs) {

    const offences = {};

    jobs.forEach(job => {

        const offence =
            (job.FORENSICOFFENCECATEGORY || "Unknown").trim();

        offences[offence] =
            (offences[offence] || 0) + 1;

    });

    return Object
        .entries(offences)
        .sort(
            (a, b) => b[1] - a[1]
        )
        .reduce(
            (obj, [name, count]) => {

                obj[name] = count;

                return obj;

            },
            {}
        );

},

getExhibitStats(jobs) {

    let total = 0;


    jobs.forEach(job => {

        total +=
            Number(job.EXHIBITCOUNT) || 0;

    });


    return {

        total

    };

},


getQueuePriorityStats(jobs) {

    const queue = {

        catA: 0,

        catB: 0,

        catC: 0,

        total: 0

    };


    jobs.forEach(job => {

        if (
            String(job.BACKGROUNDCOLOR).toLowerCase() !== "orange"
        ) {

            return;

        }


        queue.total++;


        switch (
            Number(job.PRIORITY)
        ) {

            case 6:

                queue.catA++;

                break;

            case 4:

                queue.catB++;

                break;

            case 2:

                queue.catC++;

                break;

        }

    });


    return queue;

},

getExaminerWorkloadStats(jobs) {

    const examiners = {};


    jobs.forEach(job => {


        // Only count assigned requests
        if (
            (job.BACKGROUNDCOLOR || "")
                .toLowerCase() !== "green"
        ) {

            return;

        }


        const examiner =
            (job.ASSIGNEDTOID || "Unassigned")
                .trim();


        examiners[examiner] =
            (examiners[examiner] || 0) + 1;


    });


    return Object
        .entries(examiners)
        .sort(
            (a, b) => b[1] - a[1]
        )
        .reduce(
            (obj, [name, count]) => {

                obj[name] = count;

                return obj;

            },
            {}
        );


},

getAgeBucketStats(jobs) {

    const buckets = {

        "0-30 Days": 0,

        "31-60 Days": 0,

        "61-90 Days": 0,

        "90+ Days": 0

    };


    jobs.forEach(job => {


        if (!job.REPORTDATE) {

            return;

        }


        const reportDate =
            new Date(
                job.REPORTDATE
                    .replace(
                        " +00:00",
                        "Z"
                    )
                    .replace(
                        " ",
                        "T"
                    )
            );


        if (isNaN(reportDate)) {

            return;

        }


        const age =
            Math.floor(
                (
                    new Date() - reportDate
                )
                /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        if (age <= 30) {

            buckets["0-30 Days"]++;

        }
        else if (age <= 60) {

            buckets["31-60 Days"]++;

        }
        else if (age <= 90) {

            buckets["61-90 Days"]++;

        }
        else {

            buckets["90+ Days"]++;

        }


    });


    return buckets;


},


});