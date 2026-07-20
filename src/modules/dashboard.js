FRTools.Module.register({

    id: "dashboard",

    name: "Dashboard",

    description: "Unit Worklist dashboard.",

    version: "1.0.0",

    enabledByDefault: true,
   
    overlayId:
        "frtools-dashboard-overlay",

    pdfReady:
        false,

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

        this.loadPDFLibrary();
        this.addStyles();
        this.createButton();


        const stats =
            this.getStats();


        console.log(stats);


    },

loadPDFLibrary() {

    if (
        typeof html2pdf !== "undefined"
    ) {

        this.pdfReady = true;

        return;

    }


    const script =
        document.createElement(
            "script"
        );


    script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";


    script.onload = () => {

        this.pdfReady = true;

        console.log(
            "[FR Tools] PDF export library loaded"
        );

    };


    script.onerror = () => {

        console.error(
            "[FR Tools] Failed to load PDF export library"
        );

    };


    document.head.appendChild(
        script
    );

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

                padding: 20px;

                font-size: 14px;

                overflow-y: auto;

                flex: 1;

            }

            .frtools-dashboard-columns {

                display: grid;

                grid-template-columns: 1fr 1fr;

                gap: 16px;

            }


            .frtools-dashboard-column {

                min-width: 0;

            }


            .frtools-dashboard-section {

                background:
                    rgb(235,235,235);

                border:
                    1px solid #ccc;

                border-radius:
                    8px;

                padding:
                    14px;

                margin-bottom:
                    16px;

            }


            .frtools-dashboard-section-title {

                font-size:
                    15px;

                font-weight:
                    700;

                color:
                    rgb(26,38,50);

                text-align:
                    center;

                margin-bottom:
                    12px;

            }


            .frtools-dashboard-row {

                display:
                    flex;

                justify-content:
                    space-between;

                padding:
                    6px 0;

                border-bottom:
                    1px solid #ddd;

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
                    16px;


                margin-bottom:
                    12px;


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


        let overlay =
            document.getElementById(
                this.overlayId
            );


        let modal =
            document.getElementById(
                "frtools-dashboard-modal"
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

                    <span>
                        FR Tools Dashboard
                    </span>

                    <button id="frtools-dashboard-export">
                        Export PDF
                    </button>

                </div>


                    <div class="frtools-dashboard-content">

                    </div>


                </div>


            `;



            document.body.appendChild(
                overlay
            );



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


            modal =
                document.getElementById(
                    "frtools-dashboard-modal"
                );

            document
                .getElementById(
                    "frtools-dashboard-export"
                )
                .addEventListener(
                    "click",
                    () => {

                        this.exportDashboardPDF();

                    }
                );


        }



        const stats =
            this.getStats();



   modal.querySelector(
    ".frtools-dashboard-content"
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

        return this
            .getTable()
            .rows()
            .data()
            .toArray();

    },

exportDashboardPDF() {

    if (!this.pdfReady) {

        FRTools.GUI.notify(
            "PDF library is still loading..."
        );

        return;

    }


    const original =
        document.getElementById(
            "frtools-dashboard-modal"
        );


    if (!original) {

        return;

    }


    /*
        Create export copy
    */

    const exportModal =
        original.cloneNode(
            true
        );


    exportModal.id =
        "frtools-dashboard-export-copy";


    /*
        Remove Export button
    */

    const exportButton =
        exportModal.querySelector(
            "#frtools-dashboard-export"
        );


    if (exportButton) {

        exportButton.remove();

    }


    /*
        Expand fully
    */

    exportModal.style.position =
        "absolute";

    exportModal.style.left =
        "-10000px";

    exportModal.style.top =
        "0";

    exportModal.style.transform =
        "none";

    exportModal.style.maxHeight =
        "none";

    exportModal.style.height =
        "auto";

    exportModal.style.overflow =
        "visible";

    exportModal.style.width =
        "1100px";


    document.body.appendChild(
        exportModal
    );


    const options = {

        margin:
            10,

        filename:
            "FRTools_Dashboard.pdf",

        image: {

            type:
                "jpeg",

            quality:
                1

        },

        html2canvas: {

            scale:
                2,

            useCORS:
                true

        },

        jsPDF: {

            unit:
                "mm",

            format:
                "a3",

            orientation:
                "landscape"

        }

    };


    html2pdf()
        .set(options)
        .from(exportModal)
        .save()
        .then(() => {

            exportModal.remove();

        });

},

getStats() {

    const jobs =
        this.getJobs();

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