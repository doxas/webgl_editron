// modules
let fs = require('fs');
let remote = require('electron').remote;
let dialog = remote.dialog;

// variables
var editors = [];
var editorNames = ['Javascript', 'HTML', 'Vertex', 'Fragment', 'VertexPost', 'FragmentPost'];
var editorModes = ['javascript', 'html', 'glsl', 'glsl', 'glsl', 'glsl'];
var editorTheme = ['monokai', 'monokai', 'vibrant_ink', 'vibrant_ink', 'vibrant_ink', 'vibrant_ink'];
var editorThemeLight = ['tomorrow', 'tomorrow', 'tomorrow', 'tomorrow', 'tomorrow', 'tomorrow'];
var editorThemeDarken = true;
var editorFontSizePx = 14;
var activeSource = -1;
var sourceArray = [];
var popupTime = 0;
var listAddEvent = [];
var kioskMode = false;

// const var
const TARGET_FILE_NAME = [
    'javascript.js',
    'html.html',
    'vs.vert',
    'fs.frag',
    'vsp.vert',
    'fsp.frag',
    'info.json'
];

// initial
window.onload = function(){
    let e, s, t;
    editorInitialize();
    win = window;
    win.addEventListener('keydown', keydown, false);
    for(let i = 0, l = editorNames.length; i < l; i++){
        bid('tab' + editorNames[i]).addEventListener('click', tabSelecter, false);
    }
    win.addEventListener('click', function(eve){showPopup(false);}, false);
    e = bid('iconMenu');
    e.addEventListener('click', function(eve){showPopup(true);}, false);
    e = bid('iconList');
    e.addEventListener('click', loadDirectory, false);
    e = bid('hiddenDefault');
    e.addEventListener('click', loadDirectory, false);
    e = bid('iconPlay');
    e.addEventListener('click', init, false);
    e = bid('autoSave');
    e.addEventListener('click', function(eve){
        let e = bid('inputAutoSave');
        e.checked = !e.checked;
    }, false);

    run = false;

    // drag and drop
    document.ondragover = document.ondrop = function(eve){
        eve.preventDefault();
        return false;
    };
    document.addEventListener('dragleave', function(eve){return false;}, false);
    document.addEventListener('dragend', function(eve){return false;}, false);
    document.addEventListener('dragover', function(eve){return false;}, false);
    document.addEventListener('drop', function(eve){
        eve.preventDefault();
        let target = eve.dataTransfer.items;
        if(target.length !== 1){
            alert('please drop single template directory');
            return false;
        }
        let entry = null;
        if(target[0].getAsEntry){
            entry = target[0].getAsEntry();
        }else{
            entry = target[0].webkitGetAsEntry();
        }
        if(!entry || !entry.isDirectory){
            alert('invalid drop file');
            return false;
        }
        let path = eve.dataTransfer.files[0].path;
        loadDirectory(path);
        return false;
    }, false);
};

function addTempleteList(list){
    let i, j, e, f, a, s, t;
    e = bid('hidden');
    a = e.childNodes;
    if(listAddEvent.length > 0){
        for(i = 0, j = listAddEvent.length; i < j; ++i){
            if(listAddEvent[i] && listAddEvent[i].hasOwnProperty('target')){
                listAddEvent[i].target.removeEventListener('click', listAddEvent[i].function, false);
            }
        }
    }
    listAddEvent = [];
    for(i = 0, j = a.length; i < j; ++i){
        if(a[i].nodeType === 1 && a[i].id !== 'hiddenDefault'){
            e.removeChild(a[i]);
            a[i] = null;
            --i;
            --j;
        }
    }
    f = bid('hiddenDefault')
    if(!list || !list.hasOwnProperty('length') || list.length === 0){
        f.style.display = 'block';
        return;
    }else{
        f.style.display = 'none';
    }
    for(i = 0, j = list.length; i < j; ++i){
        if(!list[i]){continue;}
        s = zeroPadding(i + 1, 3);
        t = '';
        if(list[i].hasOwnProperty('info.json') && list[i]['info.json'].hasOwnProperty('title')){
            s += ': ' + list[i]['info.json'].title;
            t = list[i]['info.json'].description;
        }
        f = document.createElement('div');
        f.id = i + '_' + templateHash(loadTargetDirectory);
        f.className = 'list';
        f.textContent = s;
        f.title = t;
        listAddEvent[i] = {
            target: f,
            function: function(eve){
                let e = eve.currentTarget;
                let i = parseInt(e.id.match(/\d+/), 10);
                editorAddSource(i);
            }
        };
        f.addEventListener('click', listAddEvent[i].function, false);
        e.appendChild(f);
    }
}

function loadDirectory(path){
    let i, j, list, projectRoot, separator;
    let currentWindow = remote.getCurrentWindow();
    if(path && Object.prototype.toString.call(path) === '[object String]'){
        loaddir(path);
    }else{
        remote.dialog.showOpenDialog(currentWindow, {
            defaultPath: remote.app.getAppPath('exe'),
            properties: ['openDirectory']
        }, loaddir);
    }

    function loaddir(dir){
        let e;
        let path = '';
        if(Object.prototype.toString.call(dir) === '[object String]'){
            path = dir;
        }else{
            if(dir && dir.length > 0){
                path = dir[0];
            }else{
                console.warn('invalid directory');
                return;
            }
        }
        // directory check
        fs.readdir(path, function(err, files){
            if(err || !files || !files.hasOwnProperty('length') || files.length === 0){
                console.warn('error: readdire');
                return
            }
            separator = process.platform.match(/^win/) ? '\\' : '/';
            projectRoot = path + separator;
            list = [];
            files.filter(function(file){
                return fs.existsSync(projectRoot + file) && fs.statSync(projectRoot + file).isDirectory();
            }).forEach(function(file){
                if(file && !file.match(/\D/) && !isNaN(parseInt(file, 10))){
                    list.push({
                        index: parseInt(file, 10),
                        indexString: file,
                        targetDirectory: projectRoot + file
                    });
                }
            });

            // map for template/
            loadTargetDirectory = path;
            sourceArray = [];
            activeSource = -1;
            editorClearSource();
            addTempleteList();
            e = bid('info');
            e.textContent = '';
            document.title = 'webgl editron [ ' + loadTargetDirectory + ' ]';
            loadFileList(list, function(res){
                // add to popup list and show popup
                addTempleteList(res);
                showPopup(true);
            });
        });
    }
}

function loadFileList(list, callback){
    let i, j;
    let separator, projectRoot;
    if(!list){return;}
    for(i = 0, j = list.length; i < j; ++i){
        // map for template/i
        fs.readdir(list[i].targetDirectory, (function(item){return function(err, files){
            if(err || !files || !files.hasOwnProperty('length') || files.length === 0){
                console.warn('error: readfiles');
                return;
            }
            if(!files || files.length < TARGET_FILE_NAME.length){
                console.info('invalid directory');
                return;
            }
            separator = process.platform.match(/^win/) ? '\\' : '/';
            projectRoot = item.targetDirectory + separator;

            files.filter(function(file){
                return (
                    fs.existsSync(projectRoot + file) &&
                    fs.statSync(projectRoot + file).isFile() &&
                    fileNameMatch(file)
                );
            }).forEach(function(file){
                let fileData = {
                    index: item.index - 1,
                    fileName: file,
                    path: item.targetDirectory,
                };
                if(file.match(/jpg$/i) || file.match(/png$/i)){
                    readImage(projectRoot + file, (function(data){return function(image){
                        if(image){
                            if(!sourceArray[data.index]){sourceArray[data.index] = {path: data.path};}
                            if(!sourceArray[data.index]['images']){sourceArray[data.index]['images'] = {};}
                            sourceArray[data.index]['images'][data.fileName] = image;
                        }
                    };})(fileData));
                }else if(file.match(/info\.json/i)){
                    readFile(projectRoot + file, (function(data){return function(source){
                        let i, j, f = true;
                        if(source){
                            if(!sourceArray[data.index]){sourceArray[data.index] = {path: data.path};}
                            if(!sourceArray[data.index]['info.json']){sourceArray[data.index]['info.json'] = JSON.parse(source);}
                            for(i = 0, j = list.length; i < j; ++i){
                                f = f && sourceArray[list[i].index - 1] && checkMember(sourceArray[list[i].index - 1]);
                            }
                            if(f){callback(sourceArray);}
                        }
                    };})(fileData));
                }else{
                    readFile(projectRoot + file, (function(data){return function(source){
                        let i, j, f = true;
                        if(source){
                            if(!sourceArray[data.index]){sourceArray[data.index] = {path: data.path};}
                            sourceArray[data.index][data.fileName] = source;
                            for(i = 0, j = list.length; i < j; ++i){
                                f = f && sourceArray[list[i].index - 1] && checkMember(sourceArray[list[i].index - 1]);
                            }
                            if(f){callback(sourceArray);}
                        }
                    };})(fileData));
                }
            });
        };})(list[i]));
    }
}

function fileNameMatch(name){
    let i, f = false;
    if(name.match(/jpg$/i) || name.match(/png$/i)){
        return true;
    }
    for(i = 0; i < TARGET_FILE_NAME.length; ++i){
        f = f || (TARGET_FILE_NAME[i] === name);
    }
    return f;
}

function checkMember(arr){
    let i, j, f = true;
    for(i = 0, j = TARGET_FILE_NAME.length; i < j; ++i){
        f = f && arr.hasOwnProperty(TARGET_FILE_NAME[i]);
    }
    return f;
}

function toggleFullScreen(flag){
    if(flag == null){
        kioskMode = !kioskMode;
    }else{
        kioskMode = flag;
    }
    remote.getCurrentWindow().setKiosk(kioskMode);
}

function readFile(path, callback){
    fs.readFile(path, function(err, source){
        if(err){
            console.warn('error : ' + err);
            return;
        }
        callback(source.toString());
    });
}

function readImage(path, callback){
    let img = new Image();
    img.onload = function(){
        callback(img);
    };
    img.src = path;
}

function saveFile(){
    if(activeSource < 0){return;}
    let i, j, e;
    let separator = process.platform.match(/^win/) ? '\\' : '/';
    let path = loadTargetDirectory + separator + zeroPadding(activeSource + 1, 3) + separator;
    for(i = 0, j = TARGET_FILE_NAME.length - 1; i < j; ++i){
        fs.writeFile(path + TARGET_FILE_NAME[i], editors[i].getValue(), function(err){
            if(err){
                console.warn('error: ' + err);
                return;
            }
        });
    }
}

function showPopup(flg){
    let f, e = bid('hidden');
    if(flg === undefined || flg === null){
        f = e.style.display !== 'block';
        if(f){
            e.style.display = 'block';
            popupTime = Date.now();
        }else{
            if(Date.now() - popupTime > 100){
                e.style.display = 'none';
            }
        }
    }
    if(flg){
        e.style.display = 'block';
        popupTime = Date.now();
    }else{
        if(Date.now() - popupTime > 100){
            e.style.display = 'none';
        }
    }
}

function editorInitialize(){
    for(let i = 0, l = editorNames.length; i < l; i++){
        editors[i] = editorGenerate('editor' + editorNames[i], editorModes[i]);
    }
    editorSetTheme();
}

function editorClearSource(){
    for(let i = 0, l = editorNames.length; i < l; i++){
        editors[i].setValue('');
    }
}

function editorReloadActiveSource(){
    if(activeSource < 0){return;}
    let list = [];
    let dirName = zeroPadding(activeSource + 1, 3);
    let separator = process.platform.match(/^win/) ? '\\' : '/';
    list.push({
        index: activeSource + 1,
        indexString: dirName,
        targetDirectory: loadTargetDirectory + separator + dirName
    });
    sourceArray[activeSource] = null;
    loadFileList(list, function(res){
        editorAddSource(activeSource);
    });
}

function editorGenerate(id, mode){
    let elm;
    elm = ace.edit(id);
    elm.getSession().setMode("ace/mode/" + mode);
    elm.getSession().setUseSoftTabs(true);
    elm.getSession().setUseWorker(false);
    elm.setOption("showPrintMargin", false);
    bid(id).style.fontSize = editorFontSizePx + 'px';
    return elm;
}

function editorSetTheme(){
    for(let i = 0, l = editorNames.length; i < l; i++){
        if(editorThemeDarken){
            editors[i].setTheme("ace/theme/" + editorTheme[i]);
        }else{
            editors[i].setTheme("ace/theme/" + editorThemeLight[i]);
        }
    }
}

function editorAddSource(index){
    let i, j, e;
    if(!sourceArray[index]){return;}
    activeSource = index;
    editors[0].setValue(sourceArray[index]['javascript.js']);
    editors[1].setValue(sourceArray[index]['html.html']);
    editors[2].setValue(sourceArray[index]['vs.vert']);
    editors[3].setValue(sourceArray[index]['fs.frag']);
    editors[4].setValue(sourceArray[index]['vsp.vert']);
    editors[5].setValue(sourceArray[index]['fsp.frag']);
    editors[1].gotoLine(1);
    editors[2].gotoLine(1);
    editors[3].gotoLine(1);
    editors[4].gotoLine(1);
    editors[5].gotoLine(1);
    setTimeout(function(){editors[0].gotoLine(1);}, 100);

    e = bid('info');
    e.textContent = zeroPadding(index + 1, 3);
    if(sourceArray[index]['info.json'] && sourceArray[index]['info.json'].hasOwnProperty('title')){
        e.textContent += ': ' + sourceArray[index]['info.json'].title;
        e.title = sourceArray[index]['info.json'].description;
    }
}

function editorFontSize(upper){
    for(let i = 0, l = editorNames.length; i < l; i++){
        let e = bid('editor' + editorNames[i]);
        let size = e.style.fontSize.match(/\d+/);
        if(size != null){
            if(upper){
                editorFontSizePx = Math.max(parseInt(size[0]) + 2, 8);
                e.style.fontSize = editorFontSizePx + 'px';
            }else{
                editorFontSizePx = Math.max(parseInt(size[0]) - 2, 8);
                e.style.fontSize = editorFontSizePx + 'px';
            }
        }
    }
}

function init(){
    if(activeSource < 0){return;}
    let a, b, d, e, f;
    let s, t;
    e = bid('frame');
    try{e.contentWindow.WE.run = false;}catch(err){}
    f = e.parentNode;
    f.removeChild(e);
    e = null;
    e = document.createElement('iframe');
    e.id = 'frame';
    f.insertBefore(e, f.firstChild);
    if(kioskMode === true){
        e.style.width = window.innerWidth + 'px';
        e.style.height = window.innerHeight + 'px';
    }else{
        e.style.width = '512px';
        e.style.height = '512px';
    }
    d = e.contentDocument;
    d.open();
    d.write(editors[1].getValue());
    d.close();
    b = d.body;

    s = `
var WE = {
    parent: window.parent,
    console: null,
    consoleElement: null,
    button: null,
    run: false,
    err: null, images: null, vs: "", fs: "", vsp: "", fsp: ""
};
function initialize(){
    WE.vs  = \`${editors[2].getValue()}\`;
    WE.fs  = \`${editors[3].getValue()}\`;
    WE.vsp = \`${editors[4].getValue()}\`;
    WE.fsp = \`${editors[5].getValue()}\`;
    WE.run = false;
    WE.consoleElement = WE.parent.document.getElementById("console");
    WE.button = WE.parent.document.getElementById("iconStop");
    WE.button.addEventListener("click", function(){WE.run = false;}, false);
    WE.images = WE.parent.sourceArray[${activeSource}].images;
    window.matIV = WE.parent.matIV;
    window.qtnIV = WE.parent.qtnIV;
    window.gl3 = WE.parent.gl3;
    window.THREE = WE.parent.THREE;
    WE.console = {log: function(msg){
        let a;
        let e = WE.parent.document.createElement("p");
        let f = WE.parent.document.createElement("em");
        if(typeof msg === "number"){
            f.textContent = "log: " + msg;
        }else if(msg instanceof Array){
            f.textContent = "log: " + "[" + msg.join(', ') + "]";
        }else{
            f.textContent = "log: '" + msg + "'";
        }
        e.appendChild(f);
        WE.consoleElement.insertBefore(e, WE.consoleElement.firstChild);
        a = WE.consoleElement.children;
        if(a.length > 20){
            WE.consoleElement.removeChild(a[20]);
            a[20] = null;
        }
    }};
}
initialize();
${editors[0].getValue()}
`;

    t = d.createElement('script');
    t.textContent = s;
    setTimeout(function(){
        b.appendChild(t);
        if(e.contentWindow.WE != null){
            e.contentWindow.addEventListener('keydown', (eve) => {
                if(kioskMode === true && (eve.key === 'Escape' || eve.key === 'F11')){
                    toggleFullScreen();
                    setTimeout(init, 100);
                }
            }, false);
            if(e.contentWindow.WE.err === null){
                e = bid('console');
                f = document.createElement('p');
                d = new Date();
                f.textContent = 'loaded [' + zeroPadding(d.getHours(), 2) + ':' + zeroPadding(d.getMinutes(), 2) + ']';
                e.insertBefore(f, e.firstChild);
                a = e.children;
                if(a.length > 20){
                    e.removeChild(a[20]);
                    a[20] = null;
                }
            }
        }else{
            e = document.createElement('p');
            f = document.createElement('strong');
            f.textContent = 'editor -> javascript syntax error';
            e.appendChild(f);
            f = bid('console');
            f.insertBefore(e, f.firstChild);
        }
    }, 100);
}

function tabSelecter(eve){
    let c, d, e, t;
    e = eve.currentTarget;
    if(e.className.match(/active/)){return;}
    t = e.id.replace('tab', '');
    for(let i = 0, l = editorNames.length; i < l; i++){
        if(t === editorNames[i]){
            c = 'editor selected';
            d = 'tab active';
        }else{
            c = 'editor';
            d = 'tab';
        }
        bid('editor' + editorNames[i]).className = c;
        bid('tab' + editorNames[i]).className = d;
    }
    editorInitialize();
}

function keydown(eve){
    if(eve != null){
        if(eve.shiftKey && (eve.ctrlKey || eve.metaKey)){
            switch(eve.key){
                case 'I':
                    if(process.platform === 'darwin'){return;}
                    eve.returnValue = false;
                    remote.getCurrentWindow().openDevTools();
                    break;
                case 'o':
                    eve.returnValue = false;
                    editorReloadActiveSource();
                    break;
            }
        }else if(eve.ctrlKey || eve.metaKey){
            switch(eve.key){
                case 's':
                    eve.returnValue = false;
                    if(bid('inputAutoSave').checked){saveFile();}
                    setTimeout(init, 100);
                    return false;
                    break;
                case '-':
                    editorFontSize(false);
                    break;
                case '=':
                case ';':
                    editorFontSize(true);
                    break;
            }
        }else if(eve.altKey){
            switch(eve.key){
                case '/':
                    editorThemeDarken = !editorThemeDarken;
                    editorSetTheme();
                    break;
            }
        }else if(eve.key === 'F11'){
            toggleFullScreen();
            setTimeout(init, 100);
        }else if(kioskMode === true && (eve.key === 'Escape' || eve.key === 'F11')){
            toggleFullScreen();
            setTimeout(init, 100);
        }else{
            try{
                bid('frame').contentWindow.WE.run = (eve.key !== 'Escape');
            }catch(err){}
        }
    }
}

function bid(id){return document.getElementById(id);}

function templateHash(str){
    if(!str){return;}
    let s = str.replace(/\\/g, '/').match(/[^\/]+/g).pop();
    let d = '';
    for(let i = 0; i < s.length; ++i){
        d += s.substr(i, 1).charCodeAt();
    };
    return d;
}

function zeroPadding(num, count){
    let z = (new Array(count)).join('0');
    if((num + '').length > count){return num + '';}
    return (z + num).slice(-1 * count);
}

