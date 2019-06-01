'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

// not gc window instance
let mainWindow;

// window all closed
app.on('window-all-closed', function() {
    app.quit();
});

// initial
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: __dirname + '/icons/icon_win_256x256.ico',
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.setMenu(null);
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // if not darwin then close window
    mainWindow.on('closed', function() {
        if(process.platform !== 'darwin'){
            mainWindow = null;
        }
    });

    // darwin only
    if(process.platform === 'darwin'){
        var name = app.getName()
        var template = [{
            label: 'editron',
            submenu: [{
                role: 'undo'
            }, {
                role: 'redo'
            }, {
                type: 'separator'
            }, {
                role: 'cut'
            }, {
                role: 'copy'
            }, {
                role: 'paste'
            }, {
                role: 'pasteandmatchstyle'
            }, {
                role: 'selectall'
            }]
        }, {
            label: 'developer',
            submenu: [{
                label: 'developer tools',
                accelerator: 'Alt+Command+I',
                click (item, focusedWindow){
                    if(focusedWindow){
                        focusedWindow.webContents.toggleDevTools();
                    }
                }
            }]
        }];
        var menu = electron.Menu.buildFromTemplate(template)
        electron.Menu.setApplicationMenu(menu)
    }
});
