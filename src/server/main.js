
import http from 'http';
import fs from 'fs';
import path from 'path';
import {app, ipcMain, dialog, BrowserWindow} from 'electron';
import connect from 'electron-connect';
import local from 'connect';
import serveStatic from 'serve-static';
import util from './lib/util.js';

// constant variable ==========================================================
let macos = process.platform === 'darwin';
const LOCAL_PORT = 56565;
const IS_DEVELOPMENT = __MODE__ === 'development';
const INDEX_HTML_PATH = IS_DEVELOPMENT ? './app/client/index.html' : './client/index.html';
const MAIN_WINDOW_PARAMETER = {
    width: 1400,
    height: 750,
    frame: macos,
    webPreferences: {
        nodeIntegration: true
    }
};
if(macos === true){MAIN_WINDOW_PARAMETER.titleBarStyle = 'hidden';}

// variables ==================================================================
let mainWindow;           // main window
let connectClient;        // connector from electron-connect for client
let connectApp = local(); // connect package
let server = null;

// app events =================================================================
let isLockable = app.requestSingleInstanceLock();
if(isLockable !== true){app.quit();}

app.on('second-instance', () => {
    if(mainWindow != null){
        if(mainWindow.isMinimized() === true){
            mainWindow.restore();
        }
        mainWindow.focus();
    }
});

app.on('ready', () => {
    createMainWindow();
});

app.on('window-all-closed', () => {
    mainWindow = null;
    if(server != null){
        server.close();
        server = null;
        console.log('local server closed');
    }
    app.quit();
});

// function ===================================================================
function createMainWindow(){
    // create new browser window
    mainWindow = new BrowserWindow(MAIN_WINDOW_PARAMETER);
    mainWindow.loadFile(INDEX_HTML_PATH);

    mainWindow.on('closed', () => {
        mainWindow = null;
        if(IS_DEVELOPMENT === true){
            connectClient.sendMessage('quit', null);
        }
    });

    ipcMain.on('minimize', (evt, arg) => {
        mainWindow.minimize();
    });
    ipcMain.on('maximize', (evt, arg) => {
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
    });
    ipcMain.on('close', (evt, arg) => {
        mainWindow.close();
    });
    ipcMain.on('opendevtools', (evt, arg) => {
        mainWindow.webContents.openDevTools();
    });
    ipcMain.on('settitle', (evt, arg) => {
        mainWindow.setTitle(arg);
        evt.sender.send('settitledom', arg);
    });

    ipcMain.on('nativedialog', (evt, arg) => {
        dialog.showMessageBox(mainWindow, {
            title: arg.title,
            message: arg.message,
            buttons: arg.buttons || ['cancel', 'ok']
        }, (res) => {
            evt.sender.send('nativedialog', res);
        });
    });
    ipcMain.on('opendirectory', (evt, arg) => {
        dialog.showOpenDialog(mainWindow, {
            title: 'open editron project',
            properties: ['openDirectory']
        }, (res) => {
            if(res == null || Array.isArray(res) !== true || res.length === 0){
                evt.sender.send('localserverrunning', false);
            }else{
                util.checkDirectories(res[0])
                .then((dirnames) => {
                    if(server != null){
                        server.close();
                        server = null;
                    }
                    connectApp.use(serveStatic(res[0]));
                    server = http.createServer(connectApp);
                    server.listen(LOCAL_PORT);
                    console.log('run local server');
                    evt.sender.send('localserverrunning', {
                        dirs: dirnames,
                        pwd: res[0],
                        port: LOCAL_PORT,
                    });
                })
                .catch((err) => {
                    evt.sender.send('localserverrunning', {err: 'invalid project'});
                });
            }
        });
    });
    ipcMain.on('closelocalserver', (evt, arg) => {
        if(server != null){
            server.close();
            server = null;
            console.log('local server closed');
            evt.sender.send('localserverclosed', 'success');
        }else{
            evt.sender.send('localserverclosed', 'not running server');
        }
    });
    ipcMain.on('saveproject', (evt, arg) => {
        if(arg == null || arg.hasOwnProperty('fullPath') !== true || arg.hasOwnProperty('data') !== true){
            evt.sender.send('savefile', {err: 'invalid data'});
        }else{
            util.saveFiles(arg.fullPath, arg.data)
            .then(() => {
                evt.sender.send('savefile', 'success');
            })
            .catch((err) => {
                evt.sender.send('savefile', {err: 'save file failed'});
            });
        }
    });
    ipcMain.on('kioskmode', (evt, arg) => {
        let flag = arg === true;
        mainWindow.setKiosk(flag);
        evt.sender.send('setkiosk', flag);
    });

    if(IS_DEVELOPMENT === true){
        connectClient = connect.client.create(mainWindow);
        mainWindow.webContents.openDevTools();
    }
}

