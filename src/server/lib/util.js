
import fs from 'fs';
import path from 'path';

export default class Util {
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
    static checkFiles(target, dirname){
        return new Promise((resolve, reject) => {
            fs.readdir(target, (err, files) => {
                if(err != null || Array.isArray(files) !== true || files.length === 0){
                    reject(err);
                    return;
                }
                let promises = [];
                let flags = {
                    html: false,
                    js: false,
                    vs1: false,
                    fs1: false,
                    vs2: false,
                    fs2: false,
                };
                files.forEach((v, index) => {
                    promises.push(new Promise((res, rej) => {
                        let filePath = path.join(target, v);
                        fs.stat(filePath, (err, stat) => {
                            if(err != null || stat.isFile() !== true){
                                rej(err);
                                return;
                            }
                            if(v.search(/^index\.html$/i) > -1){flags.html = true;}
                            if(v.search(/^script\.js$/i) > -1){flags.js = true;}
                            if(v.search(/^vs1\.vert$/i) > -1){flags.vs1 = true;}
                            if(v.search(/^fs1\.frag$/i) > -1){flags.fs1 = true;}
                            if(v.search(/^vs2\.vert$/i) > -1){flags.vs2 = true;}
                            if(v.search(/^fs2\.frag$/i) > -1){flags.fs2 = true;}
                            res();
                        });
                    }));
                });
                Promise.all(promises)
                .then(() => {
                    let flag = true;
                    for(let f in flags){
                        flag = flag && flags[f];
                    }
                    if(flag === true){
                        resolve(dirname);
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
}

