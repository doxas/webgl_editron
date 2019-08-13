
import {ipcRenderer} from 'electron';
import Component from './lib/component.js';

let editor;

window.addEventListener('DOMContentLoaded', () => {
    windowSetting()
    .then(() => {
        return initialSetting();
    })
    .then(() => {
        return editorSetting();
    })
    .then(() => {
        eventSetting();
        console.log('📐: welcome editron');
    });
}, false);

function initialSetting(){
    return new Promise((resolve) => {
        let container = document.querySelector('#container');
        let split = new Component.Splitter(container, true);
        split.first.setAttribute('id', 'first');
        split.second.setAttribute('id', 'second');
        split.on('change', (arg) => {console.log(arg);});
        resolve();
    });
}

function editorSetting(){
    return new Promise((resolve) => {
        editor = ace.edit('first');
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

function eventSetting(){
    let vimMode = false;
    editor.commands.addCommand({
        name: 'disableCtrl-L',
        bindKey: {win: 'Ctrl-L', mac: 'Command-L'},
        exec: () => {},
    });
    editor.commands.addCommand({
        name: 'toggleVimMode',
        bindKey: {win: 'Ctrl-Alt-V', mac: 'Command-Alt-V'},
        exec: () => {
            if(vimMode !== true){
                editor.setKeyboardHandler('ace/keyboard/vim');
            }else{
                editor.setKeyboardHandler(null);
            }
            vimMode = !vimMode;
        },
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

