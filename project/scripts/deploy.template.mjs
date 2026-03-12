import FtpDeploy from "ftp-deploy";
import readline from "readline";

const ftpDeploy = new FtpDeploy();

// Copy this file to deploy.mjs and fill in your credentials
const FTP_HOST = "your-ftp-host.com";
const FTP_USER = "your-username";
const REMOTE_PATH = "/public_html/your-folder";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function prompt(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function main() {
    console.log("\n📦 FTP Deploy - Color Generator\n");
    console.log(`Host: ${FTP_HOST}`);
    console.log(`User: ${FTP_USER}`);
    console.log(`Path: ${REMOTE_PATH}\n`);

    const password = await prompt("FTP Password: ");

    rl.close();

    const config = {
        user: FTP_USER,
        password,
        host: FTP_HOST,
        port: 21,
        localRoot: ".output/public",
        remoteRoot: REMOTE_PATH,
        include: ["*", "**/*"],
        exclude: [],
        deleteRemote: true,
        forcePasv: true,
        sftp: false
    };

    console.log("\n🚀 Starting upload...\n");

    ftpDeploy.on("uploading", (data) => {
        console.log(`  ${data.transferredFileCount}/${data.totalFilesCount} - ${data.filename}`);
    });

    ftpDeploy.on("uploaded", (data) => {
        // Silent on success
    });

    try {
        const result = await ftpDeploy.deploy(config);
        console.log(`\n✅ Deploy complete! ${result.length} files uploaded.`);
    } catch (err) {
        console.error("\n❌ Deploy failed:", err.message);
        process.exit(1);
    }
}

main();
