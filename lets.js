const { exec } = require('child_process');
const path = require('path');

function runCommandWithElevatedPermissions(folderPath, command) {
    const os = require('os');
    const isWindows = os.platform() === 'win32';

    let cmd;
    if (isWindows) {
        // Using PowerShell to execute the command with elevated permissions
        cmd = `powershell -Command "Start-Process -Verb RunAs cmd -ArgumentList '/c cd /d ${folderPath} && ${command}'"`;
    } else {
        console.error('Unsupported operating system.');
        return;
    }

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Command stderr: ${stderr}`);
            return;
        }
        console.log(`Command output: ${stdout}`);
    });
}

// Example usage:
const folderPath = 'C:\\Users\\User\\Barcode';
const commandToRun = 'node .';

runCommandWithElevatedPermissions(folderPath, commandToRun);
