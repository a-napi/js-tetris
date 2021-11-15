import PlayingField from "./playingField.js";
import Config from  "./config.js";
import Results from "./results.js";
import HTMLdraw from "./HTMLdraw.js";

export default class GameProcess {
    constructor(mainCanvasCtx, nextTetrominoCtx) {
        this.mainCanvasCtx = mainCanvasCtx;
        this.nextTetrominoCtx = nextTetrominoCtx;
        this.cellWidth = Config.CANVAS_WIDTH / Config.PLAYING_FIELD_WIDTH;
        this.cellHeight = Config.CANVAS_HEIGHT / Config.PLAYING_FIELD_HEIGHT;
        this.startNewGame();
        this.setButtons();
    }

    setButtons(){
        document.addEventListener("keydown", function(e){
            switch (e.code) {
                case "ArrowUp":
                    if(this.pause) break;
                    this.play.rotateTetromino();
                    this.drawPlayingField(this.play.getPlayingField());
                    break;
                case "ArrowLeft":
                    if(this.pause) break;
                    this.play.moveTetrominoLeft();
                    this.drawPlayingField(this.play.getPlayingField());
                    break;
                case "ArrowRight":
                    if(this.pause) break;
                    this.play.moveTetrominoRight();
                    this.drawPlayingField(this.play.getPlayingField());
                    break;
                case "ArrowDown":
                    if(this.pause) break;
                    this.clearTimer();
                    this.play.moveTetrominoDown();
                    this.drawPlayingField(this.play.getPlayingField());
                    this.drawNextTetromino()
                    this.runGame()
                    break;
                case "Space":
                    this.togglePause();
                    this.drawPlayingField(this.play.getPlayingField());
                    break;
            }
        }.bind(this));

        document.querySelector(".pause-button").addEventListener("click", this.togglePause.bind(this));
        document.querySelector(".new-game-button").addEventListener("click", this.startNewGame.bind(this));
    }

    startNewGame() {
        this.clearTimer();
        document.querySelector(".play-info").innerHTML = "<p class='text-left'>Press 'space' to pause</p>";
        this.play = new PlayingField(Config.PLAYING_FIELD_WIDTH, Config.PLAYING_FIELD_HEIGHT);
        this.drawPlayingField(this.play.getPlayingField());
        this.numberOfTetraminoes = 0;
        this.runGame();
        this.pause = false;
        this.speed = 1;
        document.querySelector(".play-panel").style.display = 'flex';
    }

    gameOver(){
        this.pause = true;
        document.querySelector(".play-panel").style.display = 'none';
        document.querySelector(".play-info").innerHTML =
            `<div class="game-over">
                 <p class="game-over-title">GAME OVER</p>
                 <p>YOUR FINAL RESULT: </p>   
                 <p>SCORE: ${this.play.getResult().score}</p>   
                 <p>LINES: ${this.play.getResult().lines}</p>   
                 <p>LEVEL: ${this.play.getResult().level}</p>   
            </div>`;
        Results.setScore(this.play.getResult().score);
        HTMLdraw.resultsPage();
    }

    drawPlayingField(array) {
        for(let i = 0; i < array.length; i++) {
            for(let j = 0; j < array[i].length; j++) {
                if(array[i][j] === 1) {
                    this.mainCanvasCtx.fillStyle = Config.CELL_COLORS[this.play.getCurrentTetromino().name];
                }
                else {
                    this.mainCanvasCtx.fillStyle = Config.CELL_COLORS[array[i][j]];
                }
                this.mainCanvasCtx.fillRect(j * this.cellWidth, i * this.cellHeight, this.cellWidth, this.cellHeight);
                this.mainCanvasCtx.strokeRect(j * this.cellWidth, i * this.cellHeight, this.cellWidth, this.cellHeight);
            }
        }
    }
    drawNextTetromino(){
        this.nextTetrominoCtx.clearRect(0,0, Config.CANVAS_WIDTH, Config.CANVAS_WIDTH );
        const array = this.play.getNextTetromino().form;
        this.nextTetrominoCtx.fillStyle = Config.CELL_COLORS[this.play.getNextTetromino().name];
        for(let i = 0; i < array.length; i++) {
            for(let j = 0; j < array[i].length; j++) {
                if(array[i][j] === 1) {
                    this.nextTetrominoCtx.fillRect(j * this.cellWidth, i * this.cellHeight, this.cellWidth, this.cellHeight);
                    this.nextTetrominoCtx.strokeRect(j * this.cellWidth, i * this.cellHeight, this.cellWidth, this.cellHeight);
                }
            }
        }
    }

    runGame(){
        window.setInterval(function(){
            this.play.moveTetrominoDown();
            this.drawPlayingField(this.play.getPlayingField());
            this.displayGameStatus();
        }.bind(this), this.speed * 1000);
    }

    togglePause(){
        if(this.play.isGameOver()) return;
        this.pause = !this.pause;
        if(this.pause) {
            this.clearTimer()
            document.querySelector(".play-info").innerHTML = "<p class='text-left'>Press 'space' to play</p>";
        }
        else {
            this.runGame()
            document.querySelector(".play-info").innerHTML = "<p class='text-left'>Press 'space' to pause</p>";
        }
    }

    displayGameStatus(){
        if(this.play.getResult().numberOfTetraminoes !== this.numberOfTetraminoes) {
            document.querySelector(".score").innerText = this.play.getResult().score;
            document.querySelector(".level").innerText = this.play.getResult().level;
            document.querySelector(".lines").innerText = this.play.getResult().lines;
            this.setNewSpeed(this.play.getResult().level);
            this.numberOfTetraminoes = this.play.getResult().numberOfTetraminoes;
            this.drawNextTetromino()
        }
        if(this.play.isGameOver()) {
            this.clearTimer();
            this.gameOver();
        }
    }
    setNewSpeed(level) {
        this.speed = Math.pow((0.8-((level)*0.007)), level);
        this.clearTimer();
        this.runGame();
    }

    clearTimer(){
        const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
        for (let i = 1; i < interval_id; i++) {
            window.clearInterval(i);
        }
    }
}
