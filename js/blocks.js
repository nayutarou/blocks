"use strict";
import { MainView } from "./mainview.js";
import { GameView } from "./gameview.js";
import { ResultView } from "./resultview.js";



export class BlocksGame {
    #canvas;
    #context;
    /** 現在表示するビューの名前(クラス名) */
    #viewname = "";
    /** メイン画面 */
    #mainView = null;
    /** ゲーム画面*/
    #gameView = null;
    /** 結果画面 */
    #resultView = null;
    /** インターバルID */
    #intervalId = null;
    /** インターバル時間 */
    #INTERVAL_TIME_MS = 1000 / 60;

    constructor(canvasId) {

        //絶対に必要となる--
        this.#canvas = document.getElementById(canvasId);
        if (this.#canvas === null) {
            throw new Error("canvasが見つかりません")
        }
        this.#context = this.#canvas.getContext("2d");
        //-----------------

        this.#mainView = new MainView(this.#context);
        this.#gameView = new GameView(this.#context);
        this.#resultView = new ResultView(this.#context);

        // 最初の画面を指定する
        this.#viewname = "MainView";
        // ゲームウィ開始する
        this.#start();


        // this.#mainview.draw();
        // this.#gameview.draw();
        // this.#resultview.draw();

    }

    /**インターバルを開始する */
    #start() {
        this.#intervalId = setInterval(() => {
            this.#run();
        }, this.#INTERVAL_TIME_MS)
    }
    /**インターバルを停止する */
    #stop() {
        clearInterval(this.#intervalId);
        this.#intervalId = null;
    }

    #run() {
        switch (this.#viewname) {
            case "MainView":
                console.log("main");
                // ゲーム画面を描画する
                this.#gameView.draw();
                // メイン画面を描画する
                this.#mainView.draw();
                // console.log(this.#mainView.isVisible);
                // メイン画面が非表示フラグになっている場合は次の画面に切り替える
                if (this.#mainView.isVisible === false) {
                    this.#viewname = "GameView";
                }
                break;
            case "GameView":
                console.log("game");
                // 画面をクリアする
                this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
                // ゲームを更新する
                this.#gameView.update();
                // ゲーム画面を描画する
                this.#gameView.draw();
                // ゲーム画面を非表示フラグになっている場合は次に画面に切りかえる
                if (this.#gameView.isVisible === false) {
                    this.#viewname = "ResultView";
                }
                break;
            case "ResultView":
                console.log("result");
                // 結果画面を表示する
                this.#resultView.draw(this.#gameView.resultMessage);
                // ゲームを停止する
                this.#stop();
                break;
        }
    }

    setKeydownKey(key) {
        // "Enter" ->{"Enter": true}
        switch (this.#viewname) {
            case "MainView":
                this.#mainView.executePlayerAction({ [key]: true });
                break;
            case "GameView":
                this.#gameView.executePlayerAction({ [key]: true })
                break;
            case "ResultView":
                break;
        }
    }
    setKeyupKey(key) {
        // "Enter" ->{"Enter": true}
        switch (this.#viewname) {
            case "MainView":
                // this.#mainView.executePlayerAction({ [key]: true });
                break;
            case "GameView":
                this.#gameView.executePlayerAction({ [key]: false });
                break;
            case "ResultView":
                break;
        }
    }
}