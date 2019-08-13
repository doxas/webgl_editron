
import {ipcRenderer} from 'electron';

windowSetting();

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
            console.log(`%cset title dom%c: ${arg}`, 'color: maroon', 'color: inherit');
            resolve();
        });
        let title = 'webgl-editron';
        ipcRenderer.send('settitle', title);
    });
}

