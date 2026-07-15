const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const versionFile = path.join(__dirname, "..", "version.txt");

let version = fs.readFileSync(versionFile, "utf8").trim();
let [major, minor, patch] = version.split(".").map(Number);

const type = process.argv[2] || "patch";

switch (type) {
    case "major":
        major++;
        minor = 0;
        patch = 0;
        break;

    case "minor":
        minor++;
        patch = 0;
        break;

    default:
        patch++;
        break;
}

const newVersion = `${major}.${minor}.${patch}`;

fs.writeFileSync(versionFile, newVersion);

console.log(`Version ${version} → ${newVersion}`);

execSync("node build/build.js", {
    stdio: "inherit"
});