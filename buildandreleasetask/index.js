"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const child_process_1 = require("child_process");
const fs = require("fs");
function run() {
    try {
        const pathsToCheckout = tl.getInput('pathsToCheckout', true);
        let fetchDepth = tl.getInput('fetchDepth', false);
        let repositoryUri = tl.getVariable('Build.Repository.Uri');
        // Parameter validation.
        if (!fetchDepth) {
            console.log('No fetch depth was given, using default of 1');
            fetchDepth = '1';
        }
        if (fetchDepth) {
            if (isNaN(Number(fetchDepth))) {
                tl.setResult(tl.TaskResult.Failed, 'Fetch depth is not a number');
                return;
            }
            if (Number(fetchDepth) < 0) {
                tl.setResult(tl.TaskResult.Failed, 'Fetch depth is less than 0');
                return;
            }
        }
        if (pathsToCheckout == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }
        if (!pathsToCheckout) {
            tl.setResult(tl.TaskResult.Failed, 'No input was given');
            return;
        }
        if (pathsToCheckout.split('\n').length == 0) {
            tl.setResult(tl.TaskResult.Failed, 'No paths were given');
            return;
        }
        if (!repositoryUri) {
            tl.setResult(tl.TaskResult.Failed, 'Build.Repository.LocalPath is not set');
            return;
        }
        // Checkout.
        const repoPath = tl.getVariable('Build.Repository.LocalPath');
        if (repoPath) {
            if (!fs.existsSync(repoPath)) {
                fs.mkdirSync(repoPath, { recursive: true });
                console.log('Created folder:', repoPath);
            }
            else {
                console.log('Using folder:', repoPath);
            }
        }
        else {
            console.error('Build.Repository.LocalPath is not set');
            return;
        }
        process.chdir(repoPath);
        const accessToken = tl.getVariable('System.AccessToken');
        const startAzure = repositoryUri.indexOf('dev.azure.com');
        if (startAzure !== -1) {
            repositoryUri = repositoryUri.substring(startAzure);
        }
        const startGithub = repositoryUri.indexOf('github.com');
        if (startGithub !== -1) {
            repositoryUri = repositoryUri.substring(startGithub);
        }
        const sourceBranch = convertRefToBranch(tl.getVariable('Build.SourceBranch') || '');
        executeCommand(`git version`);
        let cloneCommand = `git clone --no-checkout --sparse --no-tags --progress --no-recurse-submodules https://${accessToken}@${repositoryUri} .`;
        if (Number(fetchDepth) > 0) {
            cloneCommand = `git clone --no-checkout --depth ${fetchDepth} --sparse --no-tags --progress --no-recurse-submodules https://${accessToken}@${repositoryUri} .`;
        }
        const response = executeCommand(cloneCommand);
        if (response.includes('existing Git repository')) {
            tl.setResult(tl.TaskResult.Failed, 'Repository already exists. Set "checkout:none" in previous checkout task to avoid this error.');
            return;
        }
        for (const path of pathsToCheckout.split('\n')) {
            executeCommand(`git sparse-checkout add ${path}`);
        }
        executeCommand(`git fetch origin ${sourceBranch}:local`);
        executeCommand(`git checkout local`);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}
function convertRefToBranch(ref) {
    return ref.replace('refs/heads/', '');
}
function executeCommand(command) {
    console.log('##[command]' + command);
    const response = (0, child_process_1.execSync)(command).toString();
    console.log(response);
    return response;
}
run();
