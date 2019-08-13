
const SPLITTER_COLOR = [255, 20, 147];
const SPLITTER_WIDTH = 4;
const TABSTRIP_COLOR = [240, 240, 240];
const TABSTRIP_TAB_WIDTH = 100;
const TABSTRIP_TAB_HEIGHT = 20;
const TABSTRIP_TAB_LINE_WIDTH = 4;

export default class Component {
    static get Splitter(){
        return Splitter;
    }
    static get TabStrip(){
        return TabStrip;
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
        let second = `calc(${100 - ratio * 100}% - ${SPLITTER_WIDTH / 2}px)`;
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

class Tab extends Emitter {
    static get ACTIVE(){return `${TABSTRIP_TAB_LINE_WIDTH}px solid rgb(${TABSTRIP_COLOR.join(',')})`;}
    static get DEACTIVE(){return `${TABSTRIP_TAB_LINE_WIDTH}px solid rgba(${TABSTRIP_COLOR.join(',')},0.3)`;}
    static get ACTIVE_COLOR(){return `rgb(${TABSTRIP_COLOR.join(',')})`;}
    static get DEACTIVE_COLOR(){return `rgba(${TABSTRIP_COLOR.join(',')},0.3)`;}
    constructor(parentDOM, index, title, isActive = false){
        super();
        this.parentDOM = parentDOM;
        this.index = index;
        this.wrap = document.createElement('div');
        this.wrap.textContent = title;
        this.active = isActive;
        // styling
        appendStyle(this.wrap, {
            borderBottom: this.active === true ? Tab.ACTIVE : Tab.DEACTIVE,
            color: this.active === true ? Tab.ACTIVE_COLOR : Tab.DEACTIVE_COLOR,
            lineHeight: `${TABSTRIP_TAB_HEIGHT}px`,
            minWidth: `${TABSTRIP_TAB_WIDTH}px`,
            maxWidth: `${TABSTRIP_TAB_WIDTH}px`,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            userSelect: 'none',
            cursor: 'default',
        });
        // appending
        this.parentDOM.appendChild(this.wrap);
        // event setting
        this.wrap.addEventListener('click', () => {
            this.emit('click', index);
        }, false);
        this.wrap.addEventListener('mouseenter', () => {
            appendStyle(this.wrap, {
                borderBottom: Tab.ACTIVE,
            });
        }, false);
        this.wrap.addEventListener('mouseleave', () => {
            this.update();
        }, false);
    }
    setActive(isActive){
        if(isActive == null){return;}
        this.active = isActive;
    }
    update(isActive){
        this.setActive(isActive);
        appendStyle(this.wrap, {
            color: this.active === true ? Tab.ACTIVE_COLOR : Tab.DEACTIVE_COLOR,
            borderBottom: this.active === true ? Tab.ACTIVE : Tab.DEACTIVE,
        });
    }
}

class Block extends Emitter {
    constructor(parentDOM, index, isActive = false){
        super();
        this.parentDOM = parentDOM;
        this.index = index;
        this.wrap = document.createElement('div');
        this.wrap.setAttribute('id', `page_${index}`);
        this.active = isActive;
        // styling
        appendStyle(this.wrap, {
            width: '100%',
            height: '100%',
            display: this.active === true ? 'block' : 'none',
            overflow: 'hidden',
        });
        // appending
        this.parentDOM.appendChild(this.wrap);
    }
    setActive(isActive){
        if(isActive == null){return;}
        this.active = isActive;
    }
    update(isActive){
        this.setActive(isActive);
        appendStyle(this.wrap, {
            display: this.active === true ? 'block' : 'none',
        });
    }
}

class TabStrip extends Emitter {
    constructor(parentDOM, tabs, selectedIndex){
        super();
        this.parentDOM = parentDOM;
        this.count = Math.max(1, tabs.length);
        this.index = Math.min(this.count - 1, selectedIndex);
        this.tabs = [];
        this.inners = [];
        this.wrap = document.createElement('div');
        this.tabBlock = document.createElement('div');
        this.innerBlock = document.createElement('div');

        // styling
        appendStyle(this.wrap, {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        });
        appendStyle(this.tabBlock, {
            lineHeight: `${TABSTRIP_TAB_HEIGHT}px`,
            width: '100%',
            minHeight: `${TABSTRIP_TAB_HEIGHT + TABSTRIP_TAB_LINE_WIDTH}px`,
            maxHeight: `${TABSTRIP_TAB_HEIGHT + TABSTRIP_TAB_LINE_WIDTH}px`,
            display: 'flex',
            flexDirection: 'row',
        });
        appendStyle(this.innerBlock, {
            width: '100%',
            height: `calc(100% - ${TABSTRIP_TAB_HEIGHT + TABSTRIP_TAB_LINE_WIDTH}px)`,
        });

        // appending
        this.parentDOM.appendChild(this.wrap);
        this.wrap.appendChild(this.tabBlock);
        this.wrap.appendChild(this.innerBlock);
        tabs.forEach((v, index) => {
            let item = new Tab(this.tabBlock, index, v, this.index === index);
            item.on('click', (idx) => {
                this.tabs.forEach((tab, i) => {
                    this.tabs[i].update(idx === i);
                    this.inners[i].update(idx === i);
                });
            });
            this.tabs.push(item);
            let block = new Block(this.innerBlock, index, this.index === index);
            this.inners.push(block);
        });

        // event setting
    }
    getPage(index){
        return this.inners[index].wrap;
    }
}

function appendStyle(target, style){
    for(let s in style){
        target.style[s] = style[s];
    }
}

