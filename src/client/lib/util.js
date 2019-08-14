
export default class Util {
    static appendStyle(target, style){
        for(let s in style){
            target.style[s] = style[s];
        }
    }
}

