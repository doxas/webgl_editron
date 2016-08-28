# webgl editron

webgl editor app for electron.


## about

template を読み込んで Electron で表示できる WebGL 用エディタ。

HTML と JavaScript、さらに頂点シェーダとフラグメントシェーダを編集可能で保存と同時にプレビューを更新できる。

シェーダは頂点シェーダとフラグメントシェーダをセットに、ふたつ同時に読み込む。

```
template
├── 001
│      ├ html.html     | プレビューされる HTML
│      ├ javascript.js | プレビュー実行される JS
│      ├ vs.vert       | 頂点シェーダ（その１）
│      ├ fs.frag       | フラグメントシェーダ（その１）
│      ├ vsp.vert      | 頂点シェーダ（その２）
│      ├ fsp.frag      | 頂点シェーダ（その２）
│      └ info.json     | このテンプレートのインフォメーション
├── 002
│      ├ html.html
│      ├ javascript.js
│      ├ vs.vert
│      ├ fs.frag
│      ├ vsp.vert
│      ├ fsp.frag
│      └ info.json
├── 003
├── 004
└── ...
```

ふたつ同時にシェーダを読み込めるので、ポストプロセスなどを実行可能。

`info.json` には、そのテンプレートのタイトルなどを記載。これがエディタ上でのサンプルの名前になる。

なお現状は上記全てのファイルが揃っていないと読み込めない仕様。

また、各テンプレートのディレクトリ名も三桁数字で現状は固定。このテンプレートディレクトリの中に画像（JPG or PNG）突っ込んでおくと、プレビュー実行時に渡してテクスチャなどに利用できる。


## template

テンプレートを作るときは、上記のような、三桁数字のディレクトリが連番で入っている形にする。

テンプレートが実行される際、javascript では `WE` という名前のグローバル変数を参照でき、この中に、エディタ上で編集したシェーダのソースコード、親ウィンドウのインスタンス、親ウィンドウ側で読み込んだ画像のセットなどが含まれる。


## pack

```
# mac
electron-packager ./app editron --platform=darwin --arch=x64 --version=1.3.4 --icon=webgl_editron.icns
```


## license

This software is released under the MIT License.

