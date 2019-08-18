
import util from './util.js';

let macos = process.platform === 'darwin';
const HEADER_HEIGHT = macos === true ? 22 : 36;
const FOOTER_HEIGHT = 20;
const SPLITTER_COLOR = [255, 20, 147];
const SPLITTER_WIDTH = 4;
const TABSTRIP_COLOR = [240, 240, 240];
const TABSTRIP_TAB_WIDTH = 80;
const TABSTRIP_TAB_HEIGHT = 20;
const TABSTRIP_TAB_LINE_WIDTH = 4;
const TABSTRIP_ARROW_WIDTH = 60;

export default class Component {
    static get Splitter(){
        return Splitter;
    }
    static get TabStrip(){
        return TabStrip;
    }
    static get Item(){
        return Item;
    }
}

/**
 * 簡易的なイベントエミッタ
 */
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

/**
 * DOM を分割するスプリッタ
 */
class Splitter extends Emitter {
    /**
     * @param {HTMLElement} parentDOM - スプリッタを包含する親要素
     * @param {boolean} [horizontal=true] - 水平分割かどうか
     * @param {number} [ratio=0.5] - 分割時の最初の領域の割合い（0.0 ~ 1.0）
     */
    constructor(parentDOM, horizontal = true, ratio = 0.5){
        super();
        this.parentDOM = parentDOM;
        this.horizontal = horizontal;
        this.wrap   = document.createElement('div');
        this.first  = document.createElement('div');
        this.split  = document.createElement('div');
        this.second = document.createElement('div');
        this.layer  = document.createElement('div');
        this.ratio = ratio;
        this.isDown = false;

        // styling
        util.appendStyle(this.wrap, {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: this.horizontal === true ? 'column' : 'row',
            overflow: 'hidden',
        });
        util.appendStyle(this.split, {
            backgroundColor: `rgb(${SPLITTER_COLOR.join(',')})`,
            userSelect: 'none',
        });
        util.appendStyle(this.layer, {
            backgroundColor: `rgba(36, 32, 34, 0.6)`,
            width: '100%',
            height: `calc(100% - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
            display: 'none',
            position: 'absolute',
            top: `${HEADER_HEIGHT}px`,
            left: '0px',
        });

        // appending
        this.wrap.appendChild(this.first);
        this.wrap.appendChild(this.split);
        this.wrap.appendChild(this.second);
        this.parentDOM.appendChild(this.wrap);

        // event setting
        const DOWN = (evt) => {
            this.isDown = true;
            this.split.style.zIndex = 1;
            document.querySelector('#root').appendChild(this.layer);
            this.layer.style.display = 'block';
            this.layer.addEventListener('mousemove', MOVE, false);
            this.layer.addEventListener('mouseup', UP, false);
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
            this.split.style.zIndex = '';
            document.querySelector('#root').removeChild(this.layer);
            this.layer.style.display = 'none';
            this.layer.removeEventListener('mousemove', MOVE);
            this.layer.removeEventListener('mouseup', UP);
        };
        this.split.addEventListener('mousedown', DOWN, false);
        this.split.addEventListener('mouseup', UP, false);

        this.update(ratio);
    }
    update(ratio = 0.5){
        this.ratio = ratio;
        let first = `calc(${ratio * 100}% - ${SPLITTER_WIDTH / 2}px)`;
        let second = `calc(${100 - ratio * 100}% - ${SPLITTER_WIDTH / 2}px)`;
        if(this.horizontal === true){
            util.appendStyle(this.first, {
                width: '100%',
                height: first,
            });
            util.appendStyle(this.split, {
                borderTop: `1px solid rgba(0, 0, 0, 0.3)`,
                borderBottom: `1px solid rgba(0, 0, 0, 0.3)`,
                width: '100%',
                minHeight: `${SPLITTER_WIDTH}px`,
                maxHeight: `${SPLITTER_WIDTH}px`,
                cursor: 'row-resize',
            });
            util.appendStyle(this.second, {
                width: '100%',
                height: second,
            });
        }else{
            util.appendStyle(this.first, {
                width: first,
                height: '100%',
            });
            util.appendStyle(this.split, {
                borderLeft: `1px solid rgba(0, 0, 0, 0.3)`,
                borderRight: `1px solid rgba(0, 0, 0, 0.3)`,
                minWidth: `${SPLITTER_WIDTH}px`,
                maxWidth: `${SPLITTER_WIDTH}px`,
                height: '100%',
                cursor: 'col-resize',
            });
            util.appendStyle(this.second, {
                width: second,
                height: '100%',
            });
        }
    }
    show(visible, isFirst = true){
        if(visible === true){
            this.first.style.display = 'block';
            this.split.style.display = 'block';
            this.second.style.display = 'block';
            this.update(this.ratio);
        }else{
            if(isFirst === true){
                this.split.style.display = 'none';
                this.second.style.display = 'none';
                if(this.horizontal === true){
                    this.first.style.height = '100%';
                }else{
                    this.first.style.width = '100%';
                }
            }else{
                this.first.style.display = 'none';
                this.split.style.display = 'none';
                if(this.horizontal === true){
                    this.second.style.height = '100%';
                }else{
                    this.second.style.width = '100%';
                }
            }
        }
    }
}

/**
 * タブのタイトル部分
 */
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
        util.appendStyle(this.wrap, {
            borderBottom: this.active === true ? Tab.ACTIVE : Tab.DEACTIVE,
            color: this.active === true ? Tab.ACTIVE_COLOR : Tab.DEACTIVE_COLOR,
            lineHeight: `${TABSTRIP_TAB_HEIGHT}px`,
            minWidth: `${TABSTRIP_TAB_WIDTH}px`,
            maxWidth: `${TABSTRIP_TAB_WIDTH}px`,
            padding: '0px 2px',
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
            util.appendStyle(this.wrap, {
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
        util.appendStyle(this.wrap, {
            color: this.active === true ? Tab.ACTIVE_COLOR : Tab.DEACTIVE_COLOR,
            borderBottom: this.active === true ? Tab.ACTIVE : Tab.DEACTIVE,
        });
    }
}

/**
 * タブのページ部分
 */
class Block extends Emitter {
    constructor(parentDOM, index, isActive = false){
        super();
        this.parentDOM = parentDOM;
        this.index = index;
        this.wrap = document.createElement('div');
        this.wrap.setAttribute('id', `page_${index}`);
        this.active = isActive;
        // styling
        util.appendStyle(this.wrap, {
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
        util.appendStyle(this.wrap, {
            display: this.active === true ? 'block' : 'none',
        });
    }
}

/**
 * タブストリップ
 */
class TabStrip extends Emitter {
    /**
     * @param {HTMLElement} parentDOM - スプリッタを包含する親要素
     * @param {Array.<string>} tabs - タブのタイトル部分に設定する文字列の配列
     * @param {number} selectedIndex - アクティブにするタブのインデックス
     */
    constructor(parentDOM, tabs, selectedIndex){
        super();
        this.parentDOM = parentDOM;
        this.count = Math.max(1, tabs.length);
        this.index = Math.min(this.count - 1, selectedIndex);
        this.tabs = [];
        this.inners = [];
        this.wrap            = document.createElement('div');
        this.tabBlock        = document.createElement('div');
        this.innerBlock      = document.createElement('div');
        this.tabWrapper      = document.createElement('div');
        this.tabArrowWrapper = document.createElement('div');
        this.tabArrowLeft    = document.createElement('div');
        this.tabArrowRight   = document.createElement('div');
        this.tabArrowLeft.textContent = '◀';
        this.tabArrowRight.textContent = '▶';

        // styling
        util.appendStyle(this.wrap, {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        });
        util.appendStyle(this.tabBlock, {
            lineHeight: `${TABSTRIP_TAB_HEIGHT}px`,
            width: '100%',
            minHeight: `${TABSTRIP_TAB_HEIGHT + TABSTRIP_TAB_LINE_WIDTH}px`,
            maxHeight: `${TABSTRIP_TAB_HEIGHT + TABSTRIP_TAB_LINE_WIDTH}px`,
            display: 'flex',
            flexDirection: 'row',
            userSelect: 'none',
        });
        util.appendStyle(this.tabWrapper, {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            userSelect: 'none',
        });
        util.appendStyle(this.tabArrowWrapper, {
            color: 'silver',
            textAlign: 'center',
            lineHeight: '24px',
            minWidth: '61px',
            maxWidth: '61px',
            height: '24px',
            display: 'none',
            flexDirection: 'row',
            overflow: 'hidden',
            userSelect: 'none',
        });
        util.appendStyle(this.tabArrowLeft, {
            backgroundColor: '#242226',
            minWidth: '30px',
            maxWidth: '30px',
            height: '100%',
        });
        util.appendStyle(this.tabArrowRight, {
            backgroundColor: '#242226',
            borderLeft: '1px solid #444',
            minWidth: '30px',
            maxWidth: '30px',
            height: '100%',
        });
        util.appendStyle(this.innerBlock, {
            width: '100%',
            height: `calc(100% - ${TABSTRIP_TAB_HEIGHT + TABSTRIP_TAB_LINE_WIDTH}px)`,
        });

        // appending
        this.parentDOM.appendChild(this.wrap);
        this.wrap.appendChild(this.tabBlock);
        this.wrap.appendChild(this.innerBlock);
        this.tabBlock.appendChild(this.tabWrapper);
        this.tabBlock.appendChild(this.tabArrowWrapper);
        this.tabArrowWrapper.appendChild(this.tabArrowLeft);
        this.tabArrowWrapper.appendChild(this.tabArrowRight);
        tabs.forEach((v, index) => {
            let item = new Tab(this.tabWrapper, index, v, this.index === index);
            item.on('click', (idx) => {
                this.tabs.forEach((tab, i) => {
                    this.tabs[i].update(idx === i);
                    this.inners[i].update(idx === i);
                });
                this.emit('change', idx);
            });
            this.tabs.push(item);
            let block = new Block(this.innerBlock, index, this.index === index);
            this.inners.push(block);
        });

        // event setting
        // this.tabArrowLeft

        this.update();
    }
    update(){
        let w = this.wrap.getBoundingClientRect().width - TABSTRIP_ARROW_WIDTH;
        let tw = this.tabs.length * TABSTRIP_TAB_WIDTH;
        if(w < tw){
            // show arrow
            this.tabArrowWrapper.style.display = 'flex';
        }else{
            // disable arrow
            this.tabArrowWrapper.style.display = 'none';
        }
    }
    getPage(index){
        return this.inners[index].wrap;
    }
    getAllPage(){
        let pages = this.inners.map((v) => {
            return v.wrap;
        });
        return pages;
    }
}

/**
 * サイドバーにあるソースコードリストのアイテム
 */
class Item extends Emitter {
    /**
     * @param {HTMLElement} parentDOM - スプリッタを包含する親要素
     * @param {number} index - 該当アイテムのインデックス
     * @param {string} title - 該当アイテムに表記する文字列
     * @param {boolean} isActive - 該当アイテムがアクティブかどうか
     */
    constructor(parentDOM, index, title, isActive){
        super();
        this.parentDOM = parentDOM;
        this.index = index;
        this.title = title;
        this.active = isActive;
        this.changes = false;
        this.wrap = document.createElement('div');
        this.icon = document.createElement('div');
        this.change = document.createElement('div');
        this.change.textContent = '*';
        this.label = document.createElement('div');
        this.label.textContent = title;

        // styling
        util.appendStyle(this.wrap, {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            lineHeight: '24px',
            width: '100%',
            height: '24px',
            display: 'flex',
            flexDirection: 'row',
            userSelect: 'none',
            cursor: 'pointer',
        });
        util.appendStyle(this.icon, {
            minWidth: '8px',
            maxWidth: '8px',
            height: '8px',
            margin: '8px',
        });
        util.appendStyle(this.change, {
            color: 'transparent',
            fontSize: 'x-small',
            lineHeight: '8px',
            minWidth: '8px',
            maxWidth: '8px',
            height: '8px',
            margin: '8px',
        });
        util.appendStyle(this.label, {
            color: 'silver',
        });

        // appending
        this.parentDOM.appendChild(this.wrap);
        this.wrap.appendChild(this.icon);
        this.wrap.appendChild(this.label);
        this.wrap.appendChild(this.change);

        // event setting
        this.wrap.addEventListener('mouseenter', () => {
            util.appendStyle(this.wrap, {
                backgroundColor: 'rgba(240, 240, 240, 0.25)',
            });
            util.appendStyle(this.label, {
                color: `rgb(${TABSTRIP_COLOR.join(',')})`,
            });
        }, false);
        this.wrap.addEventListener('mouseleave', () => {
            util.appendStyle(this.wrap, {
                backgroundColor: 'transparent',
            });
            util.appendStyle(this.label, {
                color: this.active === true ? `rgb(${TABSTRIP_COLOR.join(',')})` : 'silver',
            });
        }, false);
        this.wrap.addEventListener('click', () => {
            this.emit('click', this.index);
        }, false);

        this.update();
    }
    setActive(isActive){
        if(isActive == null){return;}
        this.active = isActive;
    }
    setChange(isChange){
        if(isChange == null){return;}
        this.changes = isChange;
    }
    update(isActive, isChange){
        this.setActive(isActive);
        this.setChange(isChange);
        util.appendStyle(this.icon, {
            backgroundColor: this.active === true ? 'deeppink' : 'gray',
        });
        util.appendStyle(this.change, {
            color: this.changes === true ? 'silver' : 'transparent',
        });
    }
}

