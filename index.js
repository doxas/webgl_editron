
// include
const webpack = require('webpack');
const connect = require('electron-connect');

// check arguments and import webpack config
let mode = null;
let config = null;
switch(process.argv[2]){
    case '-p':
    case '--production':
        mode = 'production';
        config = require('./webpack.config.production.js');
        break;
    case '-d':
    case '--development':
    default:
        mode = 'development';
        config = require('./webpack.config.development.js');
}
console.log(`[OK] ${mode} mode`);

// run and watch webpack
let compiler = webpack(config);
let server = connect.server;
let serverProcess = null;
if(mode === 'development'){
    // watch webpack
    compiler.watch({}, (err, stats) => {
        let json = stats.toJson();
        if(err != null){
            console.log('[ERR] webpack stats has error in callback');
            console.error(err);
            return;
        }
        if(stats.hasErrors() === true){
            console.log('[ERR] webpack stats hasErrors');
            json.errors.map((v) => {
                console.log(v);
            });
            return
        }
        if(stats.hasWarnings() === true){
            console.log('[WARNING] webpack stats hasWarnings');
            json.warnings.map((v) => {
                console.log(v);
            });
        }
        // exec electron
        if(serverProcess == null){
            // first time
            serverProcess = server.create();
            serverProcess.start();
            serverProcess.on('quit', () => {
                process.exit(0);
            });
            console.log('[OK] complete webpack, and start electron server process');
        }else{
            // is started
            let isRestart = false;
            json.modules.map((v) => {
                if(v.hasOwnProperty('built') === true && v.built === true){
                    isRestart = isRestart || v.id.includes('main.js') === true;
                }
            });
            if(isRestart === true){
                // change on server js
                console.log('[OK] restart electron server process');
                serverProcess.restart();
            }else{
                // change on client js
                console.log('[OK] reload electron render process');
                serverProcess.reload();
            }
        }
    });
}else{
    // build webpack
    compiler.run((err, stats) => {
        let json = stats.toJson();
        if(err != null){
            console.log('[ERR] webpack stats has error in callback');
            console.error(err);
            return;
        }
        if(stats.hasErrors() === true){
            console.log('[ERR] webpack stats hasErrors');
            json.errors.map((v) => {
                console.log(v);
            });
            return
        }
        if(stats.hasWarnings() === true){
            console.log('[WARNING] webpack stats hasWarnings');
            json.warnings.map((v) => {
                console.log(v);
            });
        }
        console.log('[OK] complete webpack');
    });
}
