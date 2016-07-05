#!/usr/bin/env node
//console.log('Starting directory: ' + process.cwd());
var fs = require('fs-extra');
try {
  fs.copySync('windows/icon.ico', '/home/brent/srcnode/ebpReact/release/win32-ia32/Ashley-win32-ia32/icon.ico')
  console.log("success!")
} catch (err) {
  console.error(err)
}
