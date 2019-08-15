
import fs from 'fs';
import path from 'path';

export default class Util {
    // target に指定されたパスを開き、ディレクトリが見つかったらその中身をチェックするため
    // Util.checkFiles を実行する。このとき resolve が受け取っている res には対象となる
    // 子ディレクトリの名前や、各ファイルの中身の文字列が含まれる。
    static checkDirectories(target){
        return new Promise((resolve, reject) => {
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
    // target に指定されたパスを開き、その中身が必要なファイル構成になっているかをチェックする。
    // このとき正しいファイル構成である場合は各ファイルを開いて一覧にしてから解決する。
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
                    vs1:  {data: '', exists: false},
                    fs1:  {data: '', exists: false},
                    vs2:  {data: '', exists: false},
                    fs2:  {data: '', exists: false},
                };
                files.forEach((v, index) => {
                    promises.push(new Promise((res, rej) => {
                        let filePath = path.join(target, v);
                        fs.stat(filePath, (err, stat) => {
                            if(err != null || stat.isFile() !== true){
                                rej(err);
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
                            if(v.search(/^vs1\.vert$/i) > -1){
                                flags.vs1.exists = true;
                                openPromises.push(new Promise((openResolve) => {
                                    fs.readFile(filePath, 'utf-8', (err, data) => {
                                        flags.vs1.data = data;
                                        openResolve();
                                    });
                                }));
                            }
                            if(v.search(/^fs1\.frag$/i) > -1){
                                flags.fs1.exists = true;
                                openPromises.push(new Promise((openResolve) => {
                                    fs.readFile(filePath, 'utf-8', (err, data) => {
                                        flags.fs1.data = data;
                                        openResolve();
                                    });
                                }));
                            }
                            if(v.search(/^vs2\.vert$/i) > -1){
                                flags.vs2.exists = true;
                                openPromises.push(new Promise((openResolve) => {
                                    fs.readFile(filePath, 'utf-8', (err, data) => {
                                        flags.vs2.data = data;
                                        openResolve();
                                    });
                                }));
                            }
                            if(v.search(/^fs2\.frag$/i) > -1){
                                flags.fs2.exists = true;
                                openPromises.push(new Promise((openResolve) => {
                                    fs.readFile(filePath, 'utf-8', (err, data) => {
                                        flags.fs2.data = data;
                                        openResolve();
                                    });
                                }));
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

    // target 以下に data をファイルとして保存する。
    static saveFiles(target, data){
        let files = [
            {name: 'html', file: 'index.html'},
            {name: 'js',   file: 'script.js'},
            {name: 'vs1',  file: 'vs1.vert'},
            {name: 'fs1',  file: 'fs1.frag'},
            {name: 'vs2',  file: 'vs2.vert'},
            {name: 'fs2',  file: 'fs2.frag'},
        ];
        let promises = [];
        let writePromises = [];
        return new Promise((resolve, reject) => {
            files.forEach((v, index) => {
                promises.push(new Promise((res, rej) => {
                    let filePath = path.join(target, v.file);
                    fs.stat(filePath, (err, stat) => {
                        if(err != null || stat.isFile() !== true){
                            rej(err);
                        }else{
                            writePromises.push(new Promise((writeResolve, writeReject) => {
                                fs.writeFile(filePath, data[v.name].data, (err) => {
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
        });
    }
}

