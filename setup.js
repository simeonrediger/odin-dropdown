import childProcess from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const devDependencies = ['eslint', '@eslint/js', 'globals'];

const exactDevDependencies = ['prettier'];

installPackages(devDependencies, exactDevDependencies);

const currentDirectoryName = path.basename(__dirname);
setReadmeTitle(currentDirectoryName, './README.md');
setPackageName(currentDirectoryName, './package.json');

deleteCurrentFile();
printInstructions();

function installPackages(devDependencies, exactDevDependencies) {
    let failed = false;

    if (devDependencies.length > 0) {
        const succeeded = runNpmInstall(['--save-dev', ...devDependencies]);

        if (!succeeded) {
            failed = true;
        }
    }

    if (exactDevDependencies.length > 0) {
        const succeeded = runNpmInstall([
            '--save-dev',
            '--save-exact',
            ...exactDevDependencies,
        ]);

        if (!succeeded) {
            failed = true;
        }
    }

    if (failed) {
        printError('npm install failed');
    } else {
        printSuccess('All packages installed successfully');
    }
}

function runNpmInstall(args) {
    const result = childProcess.spawnSync('npm', ['install', ...args], {
        stdio: 'inherit',
        shell: true,
    });

    const succeeded = !result.error && result.status === 0;
    return succeeded;
}

function setReadmeTitle(title, readmePath) {
    const readmeFilename = path.basename(readmePath);

    if (!fs.existsSync(readmePath)) {
        printError(`Error: Failed to locate ${readmeFilename}`);
        return;
    }

    fs.writeFileSync(readmePath, `# ${title}\n`, 'utf8');
    printSuccess(`${readmeFilename} title updated to '${title}'`);
}

function setPackageName(packageName, packagePath) {
    packageName = packageName.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    const packageFilename = path.basename(packagePath);

    if (!fs.existsSync(packagePath)) {
        printError(`Error: Failed to locate ${packageFilename}`);
        return;
    }

    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const packageNameKey = 'name';
    packageData[packageNameKey] = packageName;

    fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n');

    printSuccess(
        `${packageFilename} '${packageNameKey}' set to '${packageName}'`,
    );
}

function deleteCurrentFile() {
    fs.unlinkSync(__filename);
    printSuccess(`Purged ${path.basename(__filename)}`);
}

function printInstructions() {
    const cyan = '\x1b[36m%s\x1b[0m';

    let message = 'Update package.json, README, and project.js';
    message += ', then commit "Complete setup"';

    console.log(cyan, message);
}

function printSuccess(message) {
    const green = '\x1b[32m%s\x1b[0m';
    console.log(green, message);
}

function printError(message) {
    const red = '\x1b[31m%s\x1b[0m';
    console.error(red, message);
}
