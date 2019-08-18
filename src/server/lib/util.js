
import fs from 'fs';
import path from 'path';

export default class Util {
    /**
     * target に指定されたパスを開き、ディレクトリが見つかったらその中身をチェックするため
     * Util.checkFiles を実行する。このとき resolve が受け取っている res には対象となる
     * 子ディレクトリの名前や、各ファイルの中身の文字列が含まれる。
     */
    static checkDirectories(target){
        return new Promise((resolve, reject) => {
            // 該当ディレクトリをすべて走査
            fs.readdir(target, (err, files) => {
                if(err != null || Array.isArray(files) !== true || files.length === 0){
                    reject(err);
                    return;
                }
                let statPromises = [];
                let promises = [];
                files.forEach((v, index) => {
                    let dirPath = path.join(target, v);
                    statPromises.push(new Promise((res) => {
                        fs.stat(dirPath, (err, stat) => {
                            if(err == null && stat.isDirectory() === true){
                                // ディレクトリが見つかった場合中身を調べる
                                promises.push(Util.checkFiles(dirPath, v));
                            }
                            res();
                        });
                    }));
                });
                Promise.all(statPromises)
                .then(() => {
                    if(promises.length === 0){
                        reject('invalid directory');
                    }else{
                        Promise.all(promises)
                        .then((res) => {
                            // 取得した対象ディレクトリは非同期で処理されるので
                            // 必ずしも名前順に並んでいないためソートしてから返す
                            res.sort((a, b) => {
                                if(a.dirName < b.dirName){
                                    return -1;
                                }else if(a.dirName > b.dirName){
                                    return 1;
                                }else{
                                    return 0;
                                }
                            });
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    }
                })
            });
        });
    }
    /**
     * target に指定されたパスを開き、その中身が必要なファイル構成になっているかをチェックする。
     * このとき正しいファイル構成である場合は各ファイルを開いて一覧にしてから解決する。
     */
    static checkFiles(target, dirname){
        return new Promise((resolve, reject) => {
            fs.readdir(target, (err, files) => {
                if(err != null || Array.isArray(files) !== true || files.length === 0){
                    reject(err);
                    return;
                }
                let promises = [];
                let openPromises = [];
                let flags = {
                    html: {data: '', exists: false},
                    js:   {data: '', exists: false},
                };
                files.forEach((v, index) => {
                    promises.push(new Promise((res, rej) => {
                        let filePath = path.join(target, v);
                        fs.stat(filePath, (err, stat) => {
                            if(err != null){
                                rej(err);
                                return;
                            }
                            if(stat.isFile() !== true){
                                res();
                                return;
                            }
                            if(v.search(/^index\.html$/i) > -1){
                                flags.html.exists = true;
                                openPromises.push(new Promise((openResolve) => {
                                    fs.readFile(filePath, 'utf-8', (err, data) => {
                                        flags.html.data = data;
                                        openResolve();
                                    });
                                }));
                            }
                            if(v.search(/^script\.js$/i) > -1){
                                flags.js.exists = true;
                                openPromises.push(new Promise((openResolve) => {
                                    fs.readFile(filePath, 'utf-8', (err, data) => {
                                        flags.js.data = data;
                                        openResolve();
                                    });
                                }));
                            }
                            if(v.search(/^vs\d+\.vert$/i) > -1){
                                let num = v.match(/\d+/);
                                if(num != null && num[0] != null && isNaN(parseInt(num[0], 10)) !== true){
                                    let prop = `vs${parseInt(num[0], 10)}`;
                                    flags[prop] = {exists: true, data: ``};
                                    openPromises.push(new Promise((openResolve) => {
                                        fs.readFile(filePath, 'utf-8', (err, data) => {
                                            flags[prop].data = data;
                                            openResolve();
                                        });
                                    }));
                                }
                            }
                            if(v.search(/^fs\d+\.frag$/i) > -1){
                                let num = v.match(/\d+/);
                                if(num != null && num[0] != null && isNaN(parseInt(num[0], 10)) !== true){
                                    let prop = `fs${parseInt(num[0], 10)}`;
                                    flags[prop] = {exists: true, data: ``};
                                    openPromises.push(new Promise((openResolve) => {
                                        fs.readFile(filePath, 'utf-8', (err, data) => {
                                            flags[prop].data = data;
                                            openResolve();
                                        });
                                    }));
                                }
                            }
                            res();
                        });
                    }));
                });
                Promise.all(promises)
                .then(() => {
                    let flag = true;
                    for(let f in flags){
                        flag = flag && flags[f].exists;
                    }
                    if(flag === true){
                        Promise.all(openPromises)
                        .then(() => {
                            // ここで返したものが配列になって
                            // 最終的なクライアントへのレスポンスになる
                            resolve({
                                fullPath: target,
                                dirName: dirname,
                                data: flags,
                            });
                        });
                    }else{
                        reject('invalid files');
                    }
                })
                .catch((err) => {
                    reject(err);
                });
            });
        });
    }

    /**
     * target 以下に data をファイルとして保存する。
     */
    static saveFiles(target, data){
        let promises = [];
        let writePromises = [];
        return new Promise((resolve, reject) => {
            let names = Object.keys(data);
            names.forEach((v, index) => {
                promises.push(new Promise((res, rej) => {
                    let filePath = '';
                    switch(v){
                        case 'html':
                            filePath = path.join(target, 'index.html');
                            break;
                        case 'js':
                            filePath = path.join(target, 'script.js');
                            break;
                        default:
                            if(v.search(/^(vs|fs)\d+$/) > -1){
                                if(v.includes('vs') === true){
                                    filePath = path.join(target, `${v}.vert`);
                                }else{
                                    filePath = path.join(target, `${v}.frag`);
                                }
                            }
                    }
                    if(filePath === ''){
                        rej(`invalid member [${v}]`);
                        return;
                    }
                    fs.stat(filePath, (err, stat) => {
                        if(err != null || stat.isFile() !== true){
                            rej(err);
                        }else{
                            writePromises.push(new Promise((writeResolve, writeReject) => {
                                fs.writeFile(filePath, data[v].data, (err) => {
                                    if(err != null){
                                        writeReject(err);
                                    }else{
                                        writeResolve();
                                    }
                                });
                            }));
                            res();
                        }
                    });
                }));
            });
            Promise.all(promises)
            .then(() => {
                return Promise.all(writePromises);
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
        });
    }
}

