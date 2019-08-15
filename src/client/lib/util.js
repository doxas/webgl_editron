
export default class Util {
    /**
     * @param {HTMLElement} target - 対象の DOM
     * @param {object} style - JavaScript 表記の CSS スタイル
     */
    static appendStyle(target, style){
        for(let s in style){
            target.style[s] = style[s];
        }
    }
}

