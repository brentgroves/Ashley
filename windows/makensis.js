#!/usr/bin/env node
const spawn = require('child_process').spawn;
//process.chdir('/home/brent/srcnode/ebpReact/windows');
const options = {
  cwd: 'windows'
}

//console.log('Starting directory: ' + process.cwd());
try {
//  const ls = spawn('node', ['mwin.js'],options);
  const ls = spawn('makensis', ['installer.nsi'],options);
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

}
catch (err) {
  console.log('makensis: ' + err);
}


/*
const ls = spawn('mwin', [],options);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
*/

/*
const options =
{
  cwd: '/home/brent/srcnode/ebpReact/windows',
  env: process.env
}
console.log( options.cwd);

const ls = spawn('makensis', ['installer.nsi'],options);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
*/
