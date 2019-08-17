# webgl editron

webgl and GLSL live editor app for electron.

## development

```
$ npm install
$ npm start
```

## package

```
# for windows
$ npm run package:win

# for macos
$ npm run package:mac
```

## release build

[Releases · doxas/webgl\_editron](https://github.com/doxas/webgl_editron/releases)

## how to use

ローカルにある HTML + CSS + JavaScript で記述されたプロジェクトを開いて、編集および実行が行える WebGL の実行環境を提供するエディタです。

同時に GLSL ファイル（ `*.vert` or `*.frag` ）を開いて編集することができ、ショートカットキーや実行ボタンからリアルタイムにファイルを編集・実行します。

内部的には Electron のメインプロセス側でローカルサーバを起動してファイルを iframe で開いている形になっており、Chrome と同様の開発者ツールでのデバッグ作業などを行うこともできます。

## LICENSE

MIT.

## TODO

* [x] canvas
* [x] explorer
* [x] syntax change
* [x] run webgl
* [x] status bar
* [x] modal dialog
* [x] build for mac
* [x] menus
* [x] save and run
* [x] stop
* [x] indicate changes
* [x] resize
* [x] full screen mode
* [ ] editor generation with glsl file count
* [ ] local settings
* [ ] release v2
* [ ] 


