import FtpDeploy from "ftp-deploy";
import readline from "readline";

const ftpDeploy = new FtpDeploy();

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

    const host = await prompt("FTP Host: ");
    const user = await prompt("FTP User: ");
    const password = await prompt("FTP Password: ");
    const remoteRoot = await prompt("Remote path (e.g., /public_html/generator): ");

    rl.close();

    const config = {
        user,
        password,
        host,
        port: 21,
        localRoot: ".output/public",
        remoteRoot,
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
