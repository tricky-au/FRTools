const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");

const VERSION_FILE = path.join(ROOT, "version.txt");
const HEADER_FILE = path.join(SRC, "userscript.header");
const USER_OUTPUT_FILE = path.join(DIST, "FRTools.user.js");
const META_OUTPUT_FILE = path.join(DIST, "FRTools.meta.js");

console.log("================================");
console.log("FR Tools Build");
console.log("================================");

//
// Read Version
//

const version = fs.readFileSync(VERSION_FILE, "utf8").trim();

console.log("Version:", version);

//
// Read Header
//

let header = fs.readFileSync(HEADER_FILE, "utf8");

header = header.replace("{{VERSION}}", version);

let output = header + "\n\n";

//
// Core Source Files
//

const sourceFiles = fs.readdirSync(SRC)

    .filter(file => file.endsWith(".js"))

    .filter(file => file !== "main.js")

    .filter(file => file !== "header.js")

    .sort();


for (const file of sourceFiles) {

    const filePath = path.join(SRC, file);

    console.log("📄", file);

    output += "\n";
    output += "// ======================================\n";
    output += `// ${file}\n`;
    output += "// ======================================\n\n";

    output += fs.readFileSync(filePath, "utf8");

    output += "\n\n";

}

//
// Modules
//

const modulesDir = path.join(SRC, "modules");

if (fs.existsSync(modulesDir)) {

    const modules = fs.readdirSync(modulesDir)

        .filter(file => file.endsWith(".js"))

        .sort();


    for (const file of modules) {

        console.log("🧩", file);

        output += "\n";
        output += "// ======================================\n";
        output += `// modules/${file}\n`;
        output += "// ======================================\n\n";

        output += fs.readFileSync(
            path.join(modulesDir, file),
            "utf8"
        );

        output += "\n\n";

    }

}

//
// Application Entry Point
//

const mainFile = path.join(SRC, "main.js");

console.log("📄 main.js");

output += "\n";
output += "// ======================================\n";
output += "// main.js\n";
output += "// ======================================\n\n";

output += fs.readFileSync(mainFile, "utf8");

output += "\n\n";


//
// Ensure dist exists
//

if (!fs.existsSync(DIST)) {

    fs.mkdirSync(DIST);

}


//
// Write userscript
//

fs.writeFileSync(USER_OUTPUT_FILE, output);

//
// Write metadata file
//

fs.writeFileSync(META_OUTPUT_FILE, header + "\n");


console.log("");
console.log("✅ Build Complete");
console.log("Userscript:", USER_OUTPUT_FILE);
console.log("Metadata :", META_OUTPUT_FILE);