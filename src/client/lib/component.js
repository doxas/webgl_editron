
const SPLITTER_COLOR = [255, 20, 147];
const SPLITTER_WIDTH = 4;

export default class Component {
    static get Splitter(){
        return Splitter;
    }
}

class Emitter {
    constructor(){
        this.listeners = {};
    }
    emit(eventName, arg){
        if(this.listeners.hasOwnProperty(eventName) === true){
            this.listeners[eventName](arg);
        }
    }
    on(eventName, listener){
        this.listeners[eventName] = listener;
    }
    off(eventName){
        this.listeners[eventName] = null;
    }
}

class Splitter extends Emitter {
    constructor(parentDOM, horizontal = true){
        super();
        this.parentDOM = parentDOM;
        this.horizontal = horizontal;
        this.wrap   = document.createElement('div');
        this.first  = document.createElement('div');
        this.split  = document.createElement('div');
        this.second = document.createElement('div');
        this.isDown = false;
        this.prev = [0, 0];

        // styling
        appendStyle(this.wrap, {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: this.horizontal === true ? 'column' : 'row',
            overflow: 'hidden',
        });
        appendStyle(this.split, {
            backgroundColor: `rgb(${SPLITTER_COLOR.join(',')})`,
            userSelect: 'none',
        });

        // appending
        this.wrap.appendChild(this.first);
        this.wrap.appendChild(this.split);
        this.wrap.appendChild(this.second);
        this.parentDOM.appendChild(this.wrap);

        // event setting
        const DOWN = (evt) => {
            this.isDown = true;
            // let bound = this.parentDOM.getBoundingClientRect();
            // this.prev = [evt.clientX - bound.left, evt.clientY - bound.top];
            window.addEventListener('mousemove', MOVE, false);
            window.addEventListener('mouseup', UP, false);
        };
        const MOVE = (evt) => {
            if(this.isDown !== true){return;}
            let bound = this.parentDOM.getBoundingClientRect();
            let x = (evt.clientX - bound.left) / bound.width;
            let y = (evt.clientY - bound.top) / bound.height;
            if(this.horizontal === true){
                this.update(y);
            }else{
                this.update(x);
            }
            this.emit('change', {x, y});
        };
        const UP = (evt) => {
            this.isDown = false;
            window.removeEventListener('mousemove', MOVE);
            window.removeEventListener('mouseup', UP);
        };
        this.split.addEventListener('mousedown', DOWN, false);

        this.update();
    }
    update(ratio = 0.5){
        let first = `calc(${ratio * 100}% - ${SPLITTER_WIDTH / 2}px)`;
        let second = `calc(${100 - first}% - ${SPLITTER_WIDTH / 2}px)`;
        if(this.horizontal === true){
            appendStyle(this.first, {
                width: '100%',
                height: first,
            });
            appendStyle(this.split, {
                borderTop: `1px solid rgba(0, 0, 0, 0.3)`,
                borderBottom: `1px solid rgba(0, 0, 0, 0.3)`,
                width: '100%',
                minHeight: `${SPLITTER_WIDTH}px`,
                maxHeight: `${SPLITTER_WIDTH}px`,
                cursor: 'row-resize',
            });
            appendStyle(this.second, {
                width: '100%',
                height: second,
            });
        }else{
            appendStyle(this.first, {
                width: first,
                height: '100%',
            });
            appendStyle(this.split, {
                borderLeft: `1px solid rgba(0, 0, 0, 0.3)`,
                borderRight: `1px solid rgba(0, 0, 0, 0.3)`,
                minWidth: `${SPLITTER_WIDTH}px`,
                maxWidth: `${SPLITTER_WIDTH}px`,
                height: '100%',
                cursor: 'col-resize',
            });
            appendStyle(this.second, {
                width: second,
                height: '100%',
            });
        }
    }
}

function appendStyle(target, style){
    for(let s in style){
        target.style[s] = style[s];
    }
}

