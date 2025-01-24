"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tl = require("azure-pipelines-task-lib/task");
var child_process_1 = require("child_process");
var fs = require("fs");
function run() {
    try {
        var pathsToCheckout = tl.getInput('pathsToCheckout', true);
        var fetchDepth = tl.getInput('fetchDepth', false);
        var repositoryUri = tl.getVariable('Build.Repository.Uri');
        var useTreeFilter = tl.getBoolInput('useTreeFilter', false) || false;
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
        var repoPath = tl.getVariable('Build.Repository.LocalPath');
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
        var accessToken = tl.getVariable('System.AccessToken');
        var startAzure = repositoryUri.indexOf('dev.azure.com');
        if (startAzure !== -1) {
            repositoryUri = repositoryUri.substring(startAzure);
        }
        var startGithub = repositoryUri.indexOf('github.com');
        if (startGithub !== -1) {
            repositoryUri = repositoryUri.substring(startGithub);
        }
        var sourceBranch = convertRefToBranch(tl.getVariable('Build.SourceBranch') || '');
        executeCommand("git version");
        var cloneCommand = "git clone --no-checkout --sparse --no-tags --progress --no-recurse-submodules";
        if (useTreeFilter) {
            cloneCommand += " --filter=tree:0";
        }
        cloneCommand += " https://".concat(accessToken, "@").concat(repositoryUri, " .");
        if (Number(fetchDepth) > 0) {
            cloneCommand = "git clone --no-checkout --depth ".concat(fetchDepth, " --sparse --no-tags --progress --no-recurse-submodules");
            if (useTreeFilter) {
                cloneCommand += " --filter=tree:0";
            }
            cloneCommand += " https://".concat(accessToken, "@").concat(repositoryUri, " .");
        }
        var response = executeCommand(cloneCommand);
        if (response.includes('existing Git repository')) {
            tl.setResult(tl.TaskResult.Failed, 'Repository already exists. Set "checkout:none" in previous checkout task to avoid this error.');
            return;
        }
        for (var _i = 0, _a = pathsToCheckout.split('\n'); _i < _a.length; _i++) {
            var path = _a[_i];
            executeCommand("git sparse-checkout add ".concat(path));
        }
        executeCommand("git fetch origin ".concat(sourceBranch, ":local"));
        executeCommand("git checkout local");
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
    var response = (0, child_process_1.execSync)(command).toString();
    console.log(response);
    return response;
}
run();
