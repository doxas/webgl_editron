'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

// not gc window instance
let mainWindow;

// window all closed
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// initial
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 1500,
        height: 1000
    });
    mainWindow.setMenu(null);
    mainWindow.loadURL('file://' + __dirname + '/app/index.html');

    // open devtools
    mainWindow.webContents.openDevTools();

    // if not darwin then close window
    mainWindow.on('closed', function() {
        if(process.platform !== 'darwin'){
            mainWindow = null;
        }
    });


});
