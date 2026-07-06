const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const VERSION_FILE = path.join(__dirname, "..", "version.txt");

let currentVersion;
let newVersion;
let releaseTitle = "";
let releaseNotes = "";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showBanner() {

    console.clear();

    currentVersion = fs.readFileSync(VERSION_FILE, "utf8").trim();

    const [major, minor, patch] = currentVersion.split(".").map(Number);

    console.log("=================================================");
    console.log("               FR Tools Release Manager");
    console.log("=================================================");
    console.log("");

    console.log("Current Version :", currentVersion);
    console.log("");

    console.log(`1) Patch  → ${major}.${minor}.${patch + 1}`);
    console.log(`2) Minor  → ${major}.${minor + 1}.0`);
    console.log(`3) Major  → ${major + 1}.0.0`);
    console.log("");

    chooseVersion();

}

function chooseVersion() {

    rl.question("Choose release type (1-3): ", answer => {

        const [major, minor, patch] = currentVersion
            .split(".")
            .map(Number);

        switch (answer.trim()) {

            case "1":
                newVersion = `${major}.${minor}.${patch + 1}`;
                break;

            case "2":
                newVersion = `${major}.${minor + 1}.0`;
                break;

            case "3":
                newVersion = `${major + 1}.0.0`;
                break;

            default:
                console.log("");
                console.log("❌ Invalid selection.");
                console.log("");
                return chooseVersion();
        }

        getReleaseTitle();

    });

}

function getReleaseTitle() {

    console.log("");

    rl.question("Release title: ", answer => {

        releaseTitle = answer.trim();

        getReleaseNotes();

    });

}

function getReleaseNotes() {

    console.log("");
    console.log("Release notes");
    console.log("(Press Enter on an empty line when finished)");
    console.log("");

    const lines = [];

    function ask() {

        rl.question("> ", line => {

            if (line === "") {

                releaseNotes = lines.join("\n");

                return confirmRelease();

            }

            lines.push(line);

            ask();

        });

    }

    ask();

}



function confirmRelease() {

    console.log("");
    console.log("=================================================");
    console.log("                 Release Summary");
    console.log("=================================================");
    console.log("");

    console.log("Current Version :", currentVersion);
    console.log("New Version     :", newVersion);
    console.log("");

    console.log("Release Title");
    console.log("-------------");
    console.log(releaseTitle || "(None)");
    console.log("");

    console.log("Release Notes");
    console.log("-------------");
    console.log(releaseNotes || "(None)");
    console.log("");

    rl.question("Proceed? (Y/N): ", answer => {

        const response = answer.trim().toUpperCase();

        if (response === "Y") {

            runLint();

            return;

        }

        console.log("");
        console.log("❌ Release cancelled.");
        console.log("");

        rl.close();

    });

}

function runLint() {

    console.log("");
    console.log("🔍 Running ESLint...");
    console.log("");

    try {

        execSync("npm run lint", {
            stdio: "inherit"
        });

        console.log("");
        console.log("✅ ESLint Passed");
        console.log("");

        updateVersion();

    }
    catch {

        console.log("");
        console.log("❌ ESLint Failed");
        console.log("");

        rl.close();

    }

}

function updateVersion() {

    fs.writeFileSync(VERSION_FILE, newVersion);

    console.log("✅ Updated version.txt");
    console.log("");

    build();

}

function build() {

    console.log("🔨 Building FR Tools...");
    console.log("");

    execSync("npm run build", {
        stdio: "inherit"
    });

    console.log("");

    gitStage();

}

function gitStage() {

    console.log("");
    console.log("📦 Staging changes...");
    console.log("");

    try {

        execSync("git add .", {
            stdio: "inherit"
        });

        console.log("");
        console.log("✅ Changes staged");
        console.log("");

        gitCommit();

    } catch (err) {

        console.log("");
        console.log("❌ Git staging failed");
        console.log("Make sure this is a git repository.");
        console.log("");

        rl.close();

    }
}

function gitCommit() {

    console.log("");
    console.log("📝 Creating commit...");
    console.log("");

    const safeTitle = releaseTitle.replace(/"/g, '\\"');
    const commitMessage = `v${newVersion} - ${safeTitle}`;

    try {

        execSync(`git commit -m "${commitMessage}"`, {
            stdio: "inherit"
        });

        console.log("");
        console.log("✅ Commit created");
        console.log("");
        console.log("🚀 Ready to push (use VS Code Sync Changes)");
        console.log("");

        finish();

    } catch (err) {

        console.log("");
        console.log("❌ Git commit failed");
        console.log("Make sure you have staged changes and Git is initialized.");
        console.log("");

        rl.close();

    }
}

function finish() {

    console.log("=================================================");
    console.log("            Release Ready");
    console.log("=================================================");
    console.log("");

    console.log("Version :", newVersion);
    console.log("");
    console.log("Everything completed successfully.");
    console.log("");
    console.log("Next steps:");
    console.log("");
    console.log("1. Review the generated userscript.");
    console.log("2. Commit your changes.");
    console.log("3. Click 'Sync Changes' in VS Code.");
    console.log("");
    console.log("GitHub Actions will automatically create the release.");
    console.log("");

    rl.close();

}

showBanner();