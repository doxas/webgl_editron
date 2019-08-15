
import {ipcRenderer, webFrame} from 'electron';
import util from './lib/util.js';
import Component from './lib/component.js';

let macos = process.platform === 'darwin';
let latestResponse = null;
let latestActive = null;
let items = [];
let pages = [];
let editors = [];
let editorMode = [
    {mode: 'html',       name: 'html', title: 'HTML'},
    {mode: 'javascript', name: 'js',   title: 'js'},
    {mode: 'glsl',       name: 'vs1',  title: 'vert(1)'},
    {mode: 'glsl',       name: 'fs1',  title: 'frag(1)'},
    {mode: 'glsl',       name: 'vs2',  title: 'vert(2)'},
    {mode: 'glsl',       name: 'fs2',  title: 'frag(2)'},
];

const FONT_SIZE = 16;
const LIGHT_THEME = 'ace/theme/tomorrow';
const DARK_THEME = 'ace/theme/tomorrow_night_bright';
const BUTTON_BLOCK_HEIGHT = 32;
const ICON_SIZE = 16;
const ICON_MARGIN = '8px 7px';
const EDITOR_OPTION = {
    highlightActiveLine: true,
    highlightSelectedWord: true,
    useSoftTabs: true,
    navigateWithinSoftTabs: true,
    vScrollBarAlwaysVisible: true,
    autoScrollEditorIntoView: true,
    scrollPastEnd: 1.0,
    highlightGutterLine: true,
    showPrintMargin: false,
    printMargin: false,
    displayIndentGuides: true,
    fontSize: `${FONT_SIZE}px`,
    fontFamily: '"Ricty Diminished Discord", "Ricty Diminished", Ricty, Monaco, consolas, monospace',
    theme: DARK_THEME,
    enableBasicAutocompletion: true,
    enableSnippets: false,
    enableLiveAutocompletion: true,
};

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

        setStatusBarMessage('📐: welcome editron');
        setStatusBarIcon(
            '#windowinterfacestatuseditron',
            'green', true,
            'editron initialize success'
        );
    });
}, false);

function setStatusBarMessage(text){
    let message = document.querySelector('#windowinterfacestatusmessage');
    message.textContent = text;
}

function setStatusBarIcon(targetId, stat, add, title){
    let icon = document.querySelector(targetId);
    if(add === true){
        icon.classList.add(stat);
    }else{
        icon.classList.remove(stat);
    }
    icon.setAttribute('title', title);
}

function windowSetting(){
    let fontSize = FONT_SIZE;
    let dark = true;
    webFrame.setZoomFactor(1);
    webFrame.setVisualZoomLevelLimits(1, 1);
    webFrame.setLayoutZoomLevelLimits(0, 0);
    return new Promise((resolve) => {
        // header
        let ttl = document.body.querySelector('#windowinterfacetitle');
        let min = document.body.querySelector('#windowinterfacecontrollermin');
        let max = document.body.querySelector('#windowinterfacecontrollermax');
        let cls = document.body.querySelector('#windowinterfacecontrollerclose');
        if(macos === true){
            let head = document.body.querySelector('#windowinterfaceheader');
            let menu = document.body.querySelector('#windowinterfacemenuicon');
            let ctrl = document.body.querySelector('#windowinterfacecontroller');
            head.style.lineHeight = '22px';
            head.style.minHeight  = '22px';
            head.style.maxHeight  = '22px';
            menu.style.minWidth = '4px';
            menu.style.maxWidth = '4px';
            ttl.style.fontSize = 'smaller';
            ttl.style.textAlign = 'center';
            ttl.style.padding = '0px 8px 0px 64px';
            ctrl.style.display = 'none';
        }else{
            min.addEventListener('click', () => {ipcRenderer.send('minimize', true);}, false);
            max.addEventListener('click', () => {ipcRenderer.send('maximize', true);}, false);
            cls.addEventListener('click', () => {ipcRenderer.send('close', true);}, false);
        }
        // footer
        let footer = document.body.querySelector('#windowinterfacefooter');
        window.addEventListener('keydown', (evt) => {
            switch(evt.key){
                case 's':
                    if(evt.ctrlKey === true || evt.metaKey === true){
                        saveEditorSource();
                    }
                    break;
                case 'i':
                case 'I':
                    if(evt.ctrlKey === true || evt.metaKey === true){
                        ipcRenderer.send('opendevtools', {});
                    }
                    break;
                case 'b':
                case '∫':
                    if((evt.ctrlKey === true || evt.metaKey === true) && evt.altKey === true){
                        dark = !dark;
                        editors.forEach((v, index) => {
                            if(dark === true){
                                v.setTheme(DARK_THEME);
                            }else{
                                v.setTheme(LIGHT_THEME);
                            }
                        });
                    }
                    break;
                case '-':
                case '_':
                    if(evt.ctrlKey === true || evt.metaKey === true){
                        --fontSize;
                        pages.forEach((v, index) => {
                            v.style.fontSize = `${fontSize}px`;
                        });
                    }
                    break;
                case '=':
                case '+':
                    if(evt.ctrlKey === true || evt.metaKey === true){
                        ++fontSize;
                        pages.forEach((v, index) => {
                            v.style.fontSize = `${fontSize}px`;
                        });
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
        let title = 'webgl - editron';
        ipcRenderer.send('settitle', title);
    });
}

function initialSetting(){
    return new Promise((resolve) => {
        let container = document.querySelector('#container');
        let split = new Component.Splitter(container, true);
        split.first.setAttribute('id', 'first');
        split.second.setAttribute('id', 'second');
        split.on('change', (arg) => {
            editors.forEach((v) => {
                v.resize();
            });
        });

        let titles = editorMode.map((v) => {return v.title});
        let tabStrip = new Component.TabStrip(split.second, titles, 0);
        tabStrip.on('change', () => {
            editors.forEach((v) => {
                v.resize();
            });
        });
        pages = tabStrip.getAllPage();

        let vsplit = new Component.Splitter(split.first, false, 0.2);
        vsplit.first.setAttribute('id', 'vfirst');
        vsplit.second.setAttribute('id', 'vsecond');
        vsplit.on('change', (arg) => {console.log(arg);});

        let frame = document.createElement('iframe');
        frame.setAttribute('id', 'frame');
        vsplit.second.appendChild(frame);

        let leftBlock = document.createElement('div');
        util.appendStyle(leftBlock, {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        });
        let buttonBlock = document.createElement('div');
        util.appendStyle(buttonBlock, {
            width: '100%',
            minHeight: `${BUTTON_BLOCK_HEIGHT}px`,
            maxHeight: `${BUTTON_BLOCK_HEIGHT}px`,
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            userSelect: 'none',
        });
        let openFolderIcon = document.createElement('img');
        openFolderIcon.setAttribute('id', 'open');
        openFolderIcon.src = './image/folder_plus.svg';
        util.appendStyle(openFolderIcon, {
            width: `${ICON_SIZE}px`,
            height: `${ICON_SIZE}px`,
            margin: ICON_MARGIN,
            cursor: 'pointer',
            filter: 'invert(0.5)',
            userSelect: 'none',
        });
        openFolderIcon.addEventListener('mouseenter', () => {
            openFolderIcon.style.filter = 'invert(1)';
        });
        openFolderIcon.addEventListener('mouseleave', () => {
            openFolderIcon.style.filter = 'invert(0.5)';
        });
        let closeFolderIcon = document.createElement('img');
        closeFolderIcon.setAttribute('id', 'close');
        closeFolderIcon.src = './image/folder_minus.svg';
        util.appendStyle(closeFolderIcon, {
            width: `${ICON_SIZE}px`,
            height: `${ICON_SIZE}px`,
            margin: ICON_MARGIN,
            cursor: 'pointer',
            filter: 'invert(0.5)',
            userSelect: 'none',
        });
        closeFolderIcon.addEventListener('mouseenter', () => {
            closeFolderIcon.style.filter = 'invert(1)';
        });
        closeFolderIcon.addEventListener('mouseleave', () => {
            closeFolderIcon.style.filter = 'invert(0.5)';
        });
        let playIcon = document.createElement('img');
        playIcon.setAttribute('id', 'play');
        playIcon.src = './image/play.svg';
        util.appendStyle(playIcon, {
            width: `${ICON_SIZE}px`,
            height: `${ICON_SIZE}px`,
            margin: ICON_MARGIN,
            cursor: 'pointer',
            filter: 'invert(0.5)',
            userSelect: 'none',
        });
        playIcon.addEventListener('mouseenter', () => {
            playIcon.style.filter = 'invert(1)';
        });
        playIcon.addEventListener('mouseleave', () => {
            playIcon.style.filter = 'invert(0.5)';
        });
        let stopIcon = document.createElement('img');
        stopIcon.setAttribute('id', 'stop');
        stopIcon.src = './image/stop.svg';
        util.appendStyle(stopIcon, {
            width: `${ICON_SIZE}px`,
            height: `${ICON_SIZE}px`,
            margin: ICON_MARGIN,
            cursor: 'pointer',
            filter: 'invert(0.5)',
            userSelect: 'none',
        });
        stopIcon.addEventListener('mouseenter', () => {
            stopIcon.style.filter = 'invert(1)';
        });
        stopIcon.addEventListener('mouseleave', () => {
            stopIcon.style.filter = 'invert(0.5)';
        });
        let listBlock = document.createElement('div');
        listBlock.setAttribute('id', 'listblock');
        util.appendStyle(listBlock, {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        });

        vsplit.first.appendChild(leftBlock);
        leftBlock.appendChild(buttonBlock);
        leftBlock.appendChild(listBlock);
        buttonBlock.appendChild(openFolderIcon);
        buttonBlock.appendChild(closeFolderIcon);
        buttonBlock.appendChild(playIcon);
        buttonBlock.appendChild(stopIcon);

        resolve();
    });
}

function editorSetting(){
    return new Promise((resolve) => {
        pages.forEach((v, index) => {
            let editor = ace.edit(v.id);
            editor.$blockScrolling = Infinity;
            editor.setOptions(EDITOR_OPTION);
            editor.session.setMode(`ace/mode/${editorMode[index].mode}`);
            editor.session.setUseWrapMode(true);
            editor.session.setTabSize(4);

            // event setting
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
            editor.session.on('change', () => {
                if(latestResponse != null && latestActive != null && latestResponse.dirs[latestActive] != null){
                    latestResponse.dirs[latestActive].changes = true;
                    items[latestActive].update(null, true)
                }
            });

            editors.push(editor);
        });
        resolve();
    });
}

function eventSetting(){
    let open  = document.querySelector('#open');
    let close = document.querySelector('#close');
    let play  = document.querySelector('#play');
    let stop  = document.querySelector('#stop');

    open.addEventListener('click', () => {
        if(latestResponse != null && latestActive != null && items[latestActive].changes === true){
            let message = 'ソースコードの変更後、一度も実行していない変更は破棄されます。\n新規プロジェクトを開いてよろしいですか？';
            nativeDialog('info', message)
            .then((res) => {
                if(res > 0){
                    nativeOpenDirectory();
                }
            });
        }else{
            nativeOpenDirectory();
        }
    }, false);
    close.addEventListener('click', () => {
        if(latestResponse != null && latestActive != null && items[latestActive].changes === true){
            let message = 'ソースコードの変更後、一度も実行していない変更は破棄されます。\n現在のプロジェクトを閉じてよろしいですか？';
            nativeDialog('info', message)
            .then((res) => {
                if(res > 0){
                    nativeCloseServer();
                }
            });
        }else{
            nativeCloseServer();
        }
    }, false);
    play.addEventListener('click', () => {
        saveEditorSource();
    });
    stop.addEventListener('click', () => {
        clearFrame();
        setStatusBarMessage('clear');
        setStatusBarIcon('#windowinterfacestatusfile', 'red', false, '');
        setStatusBarIcon('#windowinterfacestatusfile', 'yellow', false, '');
        setStatusBarIcon('#windowinterfacestatusfile', 'green', true, 'clear frame');
    });
}

function nativeDialog(title, message, buttons){
    return new Promise((resolve) => {
        ipcRenderer.once('nativedialog', (arg, res) => {
            resolve(res);
        });
        ipcRenderer.send('nativedialog', {title: title, message: message, buttons: buttons});
    });
}

function nativeOpenDirectory(){
    ipcRenderer.once('localserverrunning', (arg, res) => {
        if(res === false){
            setStatusBarMessage('cancel on project open dialog');
        }else if(res.hasOwnProperty('err') === true){
            setStatusBarMessage(`Error: ${res.err}`);
            setStatusBarIcon('#windowinterfacestatuslocalserver', 'green', false, '');
            setStatusBarIcon('#windowinterfacestatuslocalserver', 'yellow', false, '');
            setStatusBarIcon('#windowinterfacestatuslocalserver', 'red', true, 'project open failed');
        }else{
            if(Array.isArray(res.dirs) !== true || res.dirs.length === 0){
                setStatusBarMessage(`Error: ${res.err}`);
                setStatusBarIcon('#windowinterfacestatuslocalserver', 'green', false, '');
                setStatusBarIcon('#windowinterfacestatuslocalserver', 'yellow', false, '');
                setStatusBarIcon('#windowinterfacestatuslocalserver', 'red', true, 'project open failed');
                return;
            }
            setStatusBarMessage(`open project: [ ${res.pwd} ]`)
            setStatusBarIcon('#windowinterfacestatuslocalserver', 'red', false, '');
            setStatusBarIcon('#windowinterfacestatuslocalserver', 'yellow', false, '');
            setStatusBarIcon('#windowinterfacestatuslocalserver', 'green', true, 'project open success');
            clearFrame();
            clearList();
            clearEditor();
            let left = document.querySelector('#listblock');
            items = [];
            latestResponse = res;
            latestResponse.dirs.forEach((v, index) => {
                let item = new Component.Item(left, index, v.dirName, false);
                items[index] = item;
                item.on('click', (idx) => {
                    const update = () => {
                        latestActive = idx;
                        setEditorSource(latestResponse.dirs[idx].data);
                        items.forEach((w, i) => {
                            w.update(false, false);
                        });
                        item.update(true, false);
                        setFrameSource(idx);
                        setStatusBarMessage(`start: [ ${latestResponse.dirs[idx].dirName} ]`);
                        setStatusBarIcon('#windowinterfacestatusfile', 'red', false, '');
                        setStatusBarIcon('#windowinterfacestatusfile', 'yellow', false, '');
                        setStatusBarIcon('#windowinterfacestatusfile', 'green', true, 'start success');
                    };
                    if(latestActive != null && idx !== latestActive && items[latestActive].changes === true){
                        let message = `現在のソースコード[ ${latestResponse.dirs[latestActive].dirName} ]に変更が加えられています。\n[ ${latestResponse.dirs[idx].dirName} ] を読み込むとその変更は破棄されます。読み込みを開始してよろしいですか？`;
                        nativeDialog('info', message)
                        .then((res) => {
                            if(res > 0){
                                update();
                            }
                        });
                    }else{
                        if(idx === latestActive && items[latestActive].changes === true){
                            // 現在のソースに変更が加えられているときに現在のソースを選択した場合
                            // フレームだけを更新してリスト等は操作しない
                            setFrameSource(idx);
                            setStatusBarMessage(`start: [ ${latestResponse.dirs[idx].dirName} ]`);
                            setStatusBarIcon('#windowinterfacestatusfile', 'red', false, '');
                            setStatusBarIcon('#windowinterfacestatusfile', 'yellow', false, '');
                            setStatusBarIcon('#windowinterfacestatusfile', 'green', true, 'start success');
                        }else{
                            update();
                        }
                    }
                });
            });
        }
    });
    ipcRenderer.send('opendirectory');
}

function nativeCloseServer(){
    ipcRenderer.once('localserverclosed', (arg, res) => {
        clearFrame();
        clearList();
        clearEditor();
        setStatusBarMessage(`local server closed`)
        setStatusBarIcon('#windowinterfacestatuslocalserver', 'green', false, '');
    });
    ipcRenderer.send('closelocalserver');
}

function clearFrame(){
    let frame = document.querySelector('#frame');
    frame.src = 'about:blank';
}

function clearList(){
    let left = document.querySelector('#listblock');
    while(left.children.length > 0){
        left.removeChild(left.children[0]);
    }
}

function clearEditor(){
    latestResponse = null;
    latestActive = null;
    editors.forEach((v, index) => {
        v.setValue('', -1);
    });
}

function setEditorSource(data){
    editorMode.forEach((v, index) => {
        for(let name in data){
            if(v.name === name){
                editors[index].setValue(data[name].data, -1);
                continue;
            }
        }
    });
}

function saveEditorSource(){
    if(latestResponse == null || latestActive == null){return;}
    editorMode.forEach((v, index) => {
        for(let name in latestResponse.dirs[latestActive].data){
            if(v.name === name){
                latestResponse.dirs[latestActive].data[name] = {data: editors[index].getValue(), exists: true};
                continue;
            }
        }
    });
    ipcRenderer.once('savefile', (res) => {
        if(res.hasOwnProperty('err') === true){
            setStatusBarMessage(`Error: ${res.err}`);
            setStatusBarIcon('#windowinterfacestatusfile', 'green', false, '');
            setStatusBarIcon('#windowinterfacestatusfile', 'yellow', false, '');
            setStatusBarIcon('#windowinterfacestatusfile', 'red', true, 'save file failed');
        }else{
            setStatusBarMessage(`save project: [ ${latestResponse.dirs[latestActive].dirName} ]`);
            setStatusBarIcon('#windowinterfacestatusfile', 'red', false, '');
            setStatusBarIcon('#windowinterfacestatusfile', 'yellow', false, '');
            setStatusBarIcon('#windowinterfacestatusfile', 'green', true, 'save file success');
            items[latestActive].update(null, false);
            setFrameSource(latestActive);
        }
    });
    ipcRenderer.send('saveproject', latestResponse.dirs[latestActive]);
}

function setFrameSource(index){
    let frame = document.querySelector('#frame');
    frame.src = `http://localhost:${latestResponse.port}/${latestResponse.dirs[index].dirName}`;
}

