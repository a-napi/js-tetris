import Results from "./results.js";
import Config from "./config.js";
import gameProcess from "./gameProcess.js";
const HTMLdraw = {
    resultsPage() {
        const wrapper = document.querySelector(".best-results-list");
        wrapper.innerHTML = "";
        const table = document.createElement("table");
        table.innerHTML = `
            <caption>Best Results</caption>
            <tr><td>place</td><td>score</td><td>date</td></tr>`;
        Results.getResults().forEach((item, index) => {
            const line =  document.createElement("tr");
            const indexCell =  document.createElement("td");
            indexCell.innerText = String(index + 1);
            const scoreCell =  document.createElement("td");
            scoreCell.innerText = item.score;
            const datetimeCell =  document.createElement("td");
            datetimeCell.innerText = item.datetime;
            line.append(indexCell);
            line.append(scoreCell);
            line.append(datetimeCell);
            table.append(line);
        })
        wrapper.append(table);
    },

    controlPage() {
        const wrapper = document.querySelector(".control");
        wrapper.innerHTML = "";
        const table = document.createElement("table");
        table.innerHTML = `
            <caption>Controls</caption>
            <tr><td>control</td><td>button</td></tr>
            <tr><td>move left</td><td>←</td></tr>
            <tr><td>move right</td><td>→</td></tr>
            <tr><td>fast drops</td><td>↓</td></tr>
            <tr><td>rotate</td><td>↑</td></tr>
            <tr><td>pause</td><td>space</td></tr>`;
        wrapper.append(table);
    },

    backButton() {
        document.querySelector(".back-button").addEventListener("click", function(){
            document.querySelector(".start-menu").style.display = 'flex';
            document.querySelector(".playing").style.display = 'none';
            document.querySelector(".best-results").style.display = 'none';
            document.querySelector(".control").style.display = 'none';
        });
    },
    startButton() {
        document.querySelector(".start-button").addEventListener("click", function(){
            document.querySelector(".start-menu").style.display = 'none';
            document.querySelector(".playing").style.display = 'flex';
            const mainCanvasContext = this.mainCanvasCtx();
            const nextTetrominoCanvasContext = this.nextTetrominoCanvasCtx();
            new gameProcess(mainCanvasContext, nextTetrominoCanvasContext);
        }.bind(this));
    },
    controlButton() {
        document.querySelector(".control-button").addEventListener("click", function() {
            document.querySelector(".start-menu").style.display = 'none';
            document.querySelector(".control").style.display = 'flex';
        });
    },
    resultsButton() {
        document.querySelector(".best-button").addEventListener("click", function() {
            document.querySelector(".start-menu").style.display = 'none';
            document.querySelector(".best-results").style.display = 'flex';
        });
    },

    mainCanvasCtx() {
        const mainCanvas = document.querySelector(".main-canvas");
        mainCanvas.width  = Config.CANVAS_WIDTH;
        mainCanvas.height = Config.CANVAS_HEIGHT;
        mainCanvas.style.border = "1px solid white";
        const ctx = mainCanvas.getContext("2d");
        ctx.strokeStyle = "gray";
        return ctx;
    },

    nextTetrominoCanvasCtx() {
        const nextTetrominoCanvas = document.querySelector(".next-tetromino");
        nextTetrominoCanvas.width = Config.CANVAS_HEIGHT / 5;
        nextTetrominoCanvas.height = Config.CANVAS_HEIGHT / 5;
        const nextTetrominoCtx = nextTetrominoCanvas.getContext("2d");
        nextTetrominoCtx.strokeStyle = "gray";
        return nextTetrominoCtx;
    },

}

export default HTMLdraw;
