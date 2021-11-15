import tetrominoes from "./tetrominoes.js";

export default class PlayingField {
    currentTetromino;
    gameOver;
    width;
    height;
    amountOfTetrominoes;
    result;

    constructor(width, height) {
        this.width = width + 4; // added margin for rotating tetrominoes, two at left side and two at right side
        this.height = height + 3; // added margin for rotating tetrominoes, ona at top and two at bottom
        this.amountOfTetrominoes = tetrominoes.length
        this.currentTetromino = {
            x: 0,
            y: 0,
            form: null
        }
        this.result = {
            lines: 0,
            score: 0,
            level: 0,
            numberOfTetraminoes: 0
        }
        this.gameOver = false;

        this.setStartPlayingField();
        this.createNextTetromino();
        this.addTetrominoToPlayingField();
        this.createNextTetromino();
    }

    getPlayingField(){
        let fieldToDisplay = JSON.parse(JSON.stringify(this.playingField));
        fieldToDisplay.shift();
        fieldToDisplay.pop();
        fieldToDisplay.pop();
        fieldToDisplay.forEach(row => {
            row.shift();
            row.shift();
            row.pop();
            row.pop();
        });
        return fieldToDisplay;
    }

    getCurrentTetromino(){
        return this.currentTetromino;
    }

    getNextTetromino(){
        return this.nextTetromino;
    }

    getResult(){
        return this.result
    }

    isGameOver(){
        return this.gameOver
    }

    setStartPlayingField(){
        const field = [];
        for(let i = 0; i < this.height; i++) {
            field[i] = new Array(this.width).fill(0);
        }
        this.playingField = field
    }

    createNextTetromino(){
        this.result.numberOfTetraminoes++;
        this.nextTetromino = tetrominoes[Math.floor(Math.random() * (this.amountOfTetrominoes))]
    }

    addTetrominoToPlayingField(){
        this.currentTetromino.name = this.nextTetromino.name;
        this.currentTetromino.form = [...this.nextTetromino.form];
        this.currentTetromino.x = Math.floor((this.width - this.currentTetromino.form[0].length) / 2);
        if(this.currentTetromino.form[0].filter(element => element).length) {
            this.currentTetromino.y = 1;
        } else
            this.currentTetromino.y = 0;

        if(!this.setNewPosition()) {
            this.gameOver = true;
        };
    }
    setNewPosition(){
        const newPositionSnapshot = [];
        for(let y = 0; y < this.currentTetromino.form.length; y++) {
            for(let x = 0; x < this.currentTetromino.form[0].length; x++) {
                 {
                     const coordinates = {
                         playingFieldY: y + this.currentTetromino.y,
                         playingFieldX: x + this.currentTetromino.x,
                         currentTetrominoY: y,
                         currentTetrominoX: x,
                     }
                    if(this.hasConflicts(coordinates)) {
                       return false;
                    } else {
                        newPositionSnapshot.push(coordinates)
                    }
                }
            }
        }
        this.updateTetrominoByCoordinates(0);
        newPositionSnapshot.forEach(coordinates => {
            this.playingField[coordinates.playingFieldY][coordinates.playingFieldX] =
                this.playingField[coordinates.playingFieldY][coordinates.playingFieldX]
                || this.currentTetromino.form[coordinates.currentTetrominoY][coordinates.currentTetrominoX];
        })
        return true;
    }

    moveTetrominoRight(){
        this.currentTetromino.x++
        if(!this.setNewPosition())
            this.currentTetromino.x--;
        return this.getPlayingField();
    }
    moveTetrominoLeft(){
        this.currentTetromino.x--
        if(!this.setNewPosition())
            this.currentTetromino.x++;
        return this.getPlayingField();
    }
    moveTetrominoDown(){
        this.currentTetromino.y++
        if(!this.setNewPosition()) {
            this.currentTetromino.y--;
            this.fixTetromino();
        }
        return this.getPlayingField();
    }
    rotateTetromino(){
        this.currentTetromino.form = this.rotatingClockwise(this.currentTetromino.form);
        if(!this.setNewPosition()) {
            this.currentTetromino.form = this.rotatingCounterClockwise(this.currentTetromino.form);
        }
        return this.getPlayingField();
    }

    rotatingCounterClockwise(oldForm){
        const newForm = [];
        for(let y = 0; y < oldForm[0].length; y++) {
            for(let x = 0; x < oldForm.length; x++) {
                if(!newForm[y]) newForm[y] = [];
                newForm[y][x] = oldForm[x][oldForm[x].length - 1 - y];
            }
        }
        return newForm
    }

    rotatingClockwise(oldForm){
        const newForm = [];
        for(let y = 0; y < oldForm[0].length; y++) {
            for(let x = 0; x < oldForm.length; x++) {
                if(!newForm[y]) newForm[y] = [];
                newForm[y][x] = oldForm[oldForm.length - 1 - x][y];
            }
        }
        return newForm
    }

    fixTetromino(){
        this.updateTetrominoByCoordinates(this.currentTetromino.name);
        this.checkFilledRows();
        this.addTetrominoToPlayingField();
        this.createNextTetromino();
    }

    hasConflicts({playingFieldY, playingFieldX, currentTetrominoX, currentTetrominoY}){
        if(playingFieldX > this.width - 1 ) return true;
        if(playingFieldX < 0) return true;
        if(playingFieldY > this.height - 1) return true;
        if(this.playingField[playingFieldY][playingFieldX] !== 1 && this.playingField[playingFieldY][playingFieldX] !== 0) {
            if(this.currentTetromino.form[currentTetrominoY][currentTetrominoX])
                return true;
        }
        if(this.currentTetromino.form[currentTetrominoY][currentTetrominoX]) {
            if(playingFieldX > this.width - 3) return true; // right border
            if(playingFieldX < 2) return true; // left border
            if(playingFieldY > this.height - 3) {
                return true;
            }
        }
        return false;
    }

    updateTetrominoByCoordinates(value) {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                if(this.playingField[y][x] === 1)
                    this.playingField[y][x] = value;
            }
        }
    }

    checkFilledRows() {
        let lines = 0;
        for(let i = 0; i < this.height; i++) {
            const totalEmptyCells = this.playingField[i].reduce((total, cellValue) => (cellValue === 0 ? total + 1 : total), 0);
            if(totalEmptyCells === 4) {
                this.clearRow(i);
                lines++;
                i--;
            }
        }
        if(lines)
            this.updateResults(lines)
    }

    clearRow(index){
        this.playingField.splice(index, 1);
        this.playingField.unshift(new Array(this.width).fill(0));

    }

    updateResults(lines){ // using 'original Nintendo scoring system' from https://tetris.wiki/Scoring
        this.result.lines += lines;

        switch(lines) {
            case 1: {
                this.result.score += 40 * (this.result.level + 1);
                break;
            }
            case 2: {
                this.result.score += 100 * (this.result.level + 1);
                break;
            }
            case 3: {
                this.result.score += 300 * (this.result.level + 1);
                break;
            }
            default: {
                this.result.score += 1200 * (this.result.level + 1);
                break;
            }
        }
        this.result.level = Math.floor(this.result.lines / 10);
    }
}
