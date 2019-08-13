
import {ipcRenderer} from 'electron';

window.addEventListener('DOMContentLoaded', () => {
    windowSetting()
    .then(() => {
        return editorSetting();
    })
    .then(() => {
        console.log('📐: welcome editron');
    });
}, false);

function editorSetting(){
    return new Promise((resolve) => {
        let editor = ace.edit('container');
        editor.$blockScrolling = Infinity;
        editor.setOptions({
            highlightActiveLine: true,
            highlightSelectedWord: true,
            useSoftTabs: true,
            navigateWithinSoftTabs: true,

            vScrollBarAlwaysVisible: true,
            highlightGutterLine: true,
            showPrintMargin: false,
            printMargin: false,
            displayIndentGuides: true,
            fontSize: '16px',
            fontFamily: '"Ricty Diminished Discord", "Ricty Diminished", Ricty, Monaco, consolas, monospace',
            theme: 'ace/theme/tomorrow_night_bright',

            enableBasicAutocompletion: true,
            enableSnippets: false,
            enableLiveAutocompletion: true
        });
        editor.getSession().setMode('ace/mode/javascript');
        editor.getSession().setUseWrapMode(true);
        editor.getSession().setTabSize(4);
        resolve();
    });
}

function windowSetting(){
    return new Promise((resolve) => {
        let ttl = document.body.querySelector('#windowinterfacetitle');
        let min = document.body.querySelector('#windowinterfacecontrollermin');
        let max = document.body.querySelector('#windowinterfacecontrollermax');
        let cls = document.body.querySelector('#windowinterfacecontrollerclose');
        min.addEventListener('click', () => {ipcRenderer.send('minimize', true);}, false)
        max.addEventListener('click', () => {ipcRenderer.send('maximize', true);}, false)
        cls.addEventListener('click', () => {ipcRenderer.send('close', true);}, false)
        window.addEventListener('keydown', (evt) => {
            switch(evt.key){
                case 'I':
                    if(evt.ctrlKey === true || evt.metaKey === true){
                        ipcRenderer.send('opendevtools', {});
                    }
                    break;
                case 'F12':
                    ipcRenderer.send('opendevtools', {});
                    break;
                default:
                    break;
            }
        }, false);
        ipcRenderer.on('settitledom', (evt, arg) => {
            ttl.textContent = arg;
            resolve();
        });
        let title = 'webgl-editron';
        ipcRenderer.send('settitle', title);
    });
}

