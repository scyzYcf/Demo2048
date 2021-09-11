let lines = 4;
let cells = [];
let colors = [];
let canvasWidth = 600;
let margin = 10 / (lines - 2);
let gameOver = false;
let change = true;
window.onload = () => {
    createBackground();
    document.addEventListener('keydown', function (event) {
        change = false;
        if (!gameOver) {
            switch (event.key) {
                case 'ArrowUp':
                    up();
                    break;
                case 'ArrowLeft':
                    left();
                    break;
                case 'ArrowRight':
                    right();
                    break;
                case 'ArrowDown':
                    down();
                    break;
                case 'r': //R重新开始
                case 'R': //R重新开始
                    break;
            }
            if (change)
                genNewNumber();
        }
    });
    document.addEventListener("touchstart", function (event) {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    });
    document.addEventListener("touchend", function (event) {
        endX = event.changedTouches[0].clientX;
        endY = event.changedTouches[0].clientY;
        let moveX = endX - startX;
        let moveY = endY - startY;
        let long = calcLong(endX, endY, startX, startY);
        if (!gameOver) {
            if (long > canvasWidth / 8) {
                if (Math.abs(moveX) > Math.abs(moveY)) {
                    if (moveX > 0)
                        right();
                    else
                        left();
                }
                else {
                    if (moveY > 0)
                        down();
                    else
                        up();
                }
                if (change)
                    genNewNumber();
            }
        }
    });
    document.getElementById("l4").addEventListener("click", () => {
        lines = 4;
        createBackground();
    });
    document.getElementById("l5").addEventListener("click", () => {
        lines = 5;
        createBackground();
    });
    document.getElementById("l6").addEventListener("click", () => {
        lines = 6;
        createBackground();
    });
};

let createBackground = () => {
    gameOver = false;
    change = true;
    document.querySelector("#canvas").innerHTML = "";
    if (document.body.clientWidth < canvasWidth)
        canvasWidth = document.body.clientWidth;
    document.querySelector("#canvas").setAttribute('style', 'width:' + canvasWidth + 'px;height:' + canvasWidth + 'px;');
    margin = 10 / (lines - 2);
    let width = (canvasWidth - margin * lines * 2 - 2) / lines;

    for (let i = 0; i < lines; i++)
        for (let j = 0; j < lines; j++) {
            let c = document.createElement("div");
            let fontsize = '2.5em';
            if (lines == 5)
                fontsize = '2em';
            else if (lines == 6)
                fontsize = '1.3em';
            let left = j * width + (2 * j + 1) * margin;
            let top = i * width + (2 * i + 1) * margin;
            c.setAttribute('style', 'width:' + width + 'px;height:' + width + 'px;font-size:' + fontsize + ';top:' + top + 'px;left:' + left + 'px;');
            c.setAttribute("id", "cell_" + i + '_' + j);
            c.setAttribute("class", "cell");
            c.setAttribute("data-i", i.toString());
            c.setAttribute("row", i.toString());
            c.setAttribute("data-j", j.toString());
            c.setAttribute("col", j.toString());
            document.querySelector("#canvas").appendChild(c);
        }
    genCells();
    genNewNumber();
};
let genCells = () => {
    cells = [];
    for (let i = 0; i < lines; i++) {
        let lineCells = [];
        for (let j = 0; j < lines; j++) {
            let cell = {
                text: 0,
                i: i,
                j: j
            };
            lineCells.push(cell);
        }
        cells.push(lineCells);
    }
};
// 生成随机的2或4 9:1
let random = () => {
    var num = Math.floor(Math.random() * 10);
    if (num < 1)
        return 4;
    else
        return 2;
};
//添加新数，个数由当前行列数决定
let genNewNumber = () => {
    let emptys = [];
    for (let i = 0; i < lines; i++) {
        for (let j = 0; j < lines; j++) {
            if (cells[i][j].text === 0) {
                emptys.push({
                    i: i, j: j
                });
            }
        }
    }
    let newNumCount = Math.floor(Math.random() * Math.floor(lines / 2) + 1);
    if (newNumCount > emptys.length)
        newNumCount = emptys.length;
    if (emptys.length == 1)
        newNumCount == 1;

    for (let i = 0; i < newNumCount; i++) {
        let index = Math.floor(Math.random() * emptys.length);
        let r = random();
        cells[emptys[index].i][emptys[index].j].text = r;
        document.querySelector("#cell_" + emptys[index].i + '_' + emptys[index].j).innerHTML = r.toString();
        let curColorValue = getBackgroundColor(Math.log2(r));
        document.getElementById("cell_" + emptys[index].i + '_' + emptys[index].j).style.backgroundColor = curColorValue;
        emptys.splice(index, 1);
    }
    if (judge()) {
        let over = document.createElement("div");
        over.style.backgroundColor = "rgba(0,0,0,0.5)";
        over.style.width = canvasWidth / 2 + "px";
        over.style.height = canvasWidth / 5 + "px";
        over.style.zIndex = '200';
        over.style.borderRadius = '5px';
        over.style.color = '#f00';
        over.style.fontSize = canvasWidth / 15 + 'px';
        over.style.fontWeight = 'bold';
        over.style.display = 'flex';
        over.style.justifyContent = 'center';
        over.style.alignItems = 'center';
        over.innerHTML = "游戏结束";
        document.querySelector("#canvas").appendChild(over);
    }
};
/*
根据当前值获取背景颜色
*/
let getBackgroundColor = (n) => {
    let colors = ["#fff", "#efd9bc", '#eed29c', '#f3c059', '#f7a80a', '#996601', '#3f2b02', '#050300'];
    switch (n) {
        case 0:
        case 1:
        case 2:
            return colors[0];
        case 3:
        case 4:
            return colors[1];
        case 5:
        case 6:
            return colors[2];
        case 7:
        case 8:
            return colors[3];
        case 9:
        case 10:
            return colors[4];
        case 11:
        case 12:
            return colors[5];
        case 13:
        case 14:
        case 15:
            return colors[6];
        case 16:
        case 17:
        default:
            return colors[7];
    }
};
let left = () => {
    for (let line = 0; line < lines; line++) {
        //左移去空
        for (let i = 0; i < lines - 1; i++) {
            for (let j = i + 1; j < lines; j++) {
                let current = document.querySelector("#cell_" + line + "_" + i);
                let next = document.querySelector("#cell_" + line + "_" + j);
                if (current.innerHTML === "") {
                    if (next.innerHTML != "") {
                        current.innerHTML = next.innerHTML;
                        cells[line][i].text = +next.innerHTML;
                        current.style.backgroundColor = getBackgroundColor(Math.log2(parseInt(next.innerHTML)));
                        next.innerHTML = "";
                        cells[line][j].text = 0;
                        next.style.backgroundColor = getBackgroundColor(0);
                        change = true;
                    }
                }
            }
        }
        //合并相同项
        for (let j = 0; j < lines - 1; j++) {
            let current = document.querySelector("#cell_" + line + "_" + j);
            let next = document.querySelector("#cell_" + line + "_" + (j + 1));
            if (current.innerHTML === next.innerHTML && next.innerHTML != "") {
                let mergeValue = (+current.innerHTML) + (+next.innerHTML);
                current.innerHTML = mergeValue;
                cells[line][j].text = mergeValue;
                current.style.backgroundColor = getBackgroundColor(Math.log2(parseInt(mergeValue)));
                next.innerHTML = "";
                cells[line][j + 1].text = 0;
                next.style.backgroundColor = getBackgroundColor(0);
                change = true;
            }
        }

        //左移去空
        for (let i = 0; i < lines - 1; i++) {
            for (let j = i + 1; j < lines; j++) {
                let current = document.querySelector("#cell_" + line + "_" + i);
                let next = document.querySelector("#cell_" + line + "_" + j);
                if (current.innerHTML === "") {
                    if (next.innerHTML != "") {
                        current.innerHTML = next.innerHTML;
                        cells[line][i].text = +next.innerHTML;
                        current.style.backgroundColor = getBackgroundColor(Math.log2(parseInt(next.innerHTML)));
                        next.innerHTML = "";
                        cells[line][j].text = 0;
                        next.style.backgroundColor = getBackgroundColor(0);
                        change = true;
                    }
                }
            }
        }
    }
};
let right = () => {
    for (let line = 0; line < lines; line++) {
        //右移去空
        for (let i = lines - 1; i > 0; i--) {
            for (let j = i - 1; j >= 0; j--) {
                let current = document.querySelector("#cell_" + line + "_" + i);
                let next = document.querySelector("#cell_" + line + "_" + j);
                if (current.innerHTML === "") {
                    if (next.innerHTML != "") {
                        current.innerHTML = next.innerHTML;
                        cells[line][i].text = +next.innerHTML;
                        current.style.backgroundColor = getBackgroundColor(Math.log2(parseInt(next.innerHTML)));
                        next.innerHTML = "";
                        cells[line][j].text = 0;
                        next.style.backgroundColor = getBackgroundColor(0);
                        change = true;
                    }
                }
            }
        }
        //合并相同项
        for (let j = lines - 1; j > 0; j--) {
            let current = document.querySelector("#cell_" + line + "_" + j);
            let next = document.querySelector("#cell_" + line + "_" + (j - 1));
            if (current.innerHTML === next.innerHTML && next.innerHTML != "") {
                let mergeValue = (+current.innerHTML) + (+next.innerHTML);
                current.innerHTML = mergeValue;
                cells[line][j].text = mergeValue;
                current.style.backgroundColor = getBackgroundColor(Math.log2(parseInt(mergeValue)));
                next.innerHTML = "";
                cells[line][j - 1].text = 0;
                next.style.backgroundColor = getBackgroundColor(0);
                change = true;
            }
        }

        //右移去空
        for (let i = lines - 1; i > 0; i--) {
            for (let j = i - 1; j >= 0; j--) {
                let current = document.querySelector("#cell_" + line + "_" + i);
                let next = document.querySelector("#cell_" + line + "_" + j);
                if (current.innerHTML === "") {
                    if (next.innerHTML != "") {
                        current.innerHTML = next.innerHTML;
                        cells[line][i].text = +next.innerHTML;
                        current.style.backgroundColor = getBackgroundColor(Math.log2(parseInt(next.innerHTML)));
                        next.innerHTML = "";
                        cells[line][j].text = 0;
                        next.style.backgroundColor = getBackgroundColor(0);
                        change = true;
                    }
                }
            }
        }
    }
};

let up = () => {
    for (let line = 0; line < lines; line++) { //列循环
        //上移去空
        for (let i = 0; i < lines - 1; i++) {
            for (let j = i + 1; j < lines; j++) {
                let current = document.querySelector("#cell_" + i + "_" + line);
                let next = document.querySelector("#cell_" + j + "_" + line);
                if (current.innerHTML === "") {
                    if (next.innerHTML != "") {
                        current.innerHTML = next.innerHTML;
                        cells[i][line].text = +next.innerHTML;
                        current.style.backgroundColor = getBackgroundColor(Math.log2(parseInt(next.innerHTML)));
                        next.innerHTML = "";
                        cells[j][line].text = 0;
                        next.style.backgroundColor = getBackgroundColor(0);
                        change = true;
                    }
                }
            }
        }
        //合并相同项
        for (let j = 0; j < lines - 1; j++) {
            let current = document.querySelector("#cell_" + j + "_" + line);
            let next = document.querySelector("#cell_" + (j + 1) + "_" + line);
            if (current.innerHTML === next.innerHTML && next.innerHTML != "") {
                let mergeValue = (+current.innerHTML) + (+next.innerHTML);
                current.innerHTML = mergeValue;
                cells[j][line].text = mergeValue;
                current.style.backgroundColor = getBackgroundColor(Math.log2(parseInt(mergeValue)));
                next.innerHTML = "";
                cells[j + 1][line].text = 0;
                next.style.backgroundColor = getBackgroundColor(0);
                change = true;
            }
        }

        //上移去空
        for (let i = 0; i < lines - 1; i++) {
            for (let j = i + 1; j < lines; j++) {
                let current = document.querySelector("#cell_" + i + "_" + line);
                let next = document.querySelector("#cell_" + j + "_" + line);
                if (current.innerHTML === "") {
                    if (next.innerHTML != "") {
                        current.innerHTML = next.innerHTML;
                        cells[i][line].text = +next.innerHTML;
                        current.style.backgroundColor = getBackgroundColor(Math.log2(parseInt(next.innerHTML)));
                        next.innerHTML = "";
                        cells[j][line].text = 0;
                        next.style.backgroundColor = getBackgroundColor(0);
                        change = true;
                    }
                }
            }
        }
    }
};
let down = () => {
    for (let line = 0; line < lines; line++) { //列循环
        //下移去空
        for (let i = lines - 1; i > 0; i--) {
            for (let j = i - 1; j >= 0; j--) {
                let current = document.querySelector("#cell_" + i + "_" + line);
                let next = document.querySelector("#cell_" + j + "_" + line);
                if (current.innerHTML === "") {
                    if (next.innerHTML != "") {
                        current.innerHTML = next.innerHTML;
                        cells[i][line].text = +next.innerHTML;
                        current.style.backgroundColor = getBackgroundColor(Math.log2(parseInt(next.innerHTML)));
                        next.innerHTML = "";
                        cells[j][line].text = 0;
                        next.style.backgroundColor = getBackgroundColor(0);
                        change = true;
                    }
                }
            }
        }
        //合并相同项
        for (let j = lines - 1; j > 0; j--) {
            let current = document.querySelector("#cell_" + j + "_" + line);
            let next = document.querySelector("#cell_" + (j - 1) + "_" + line);
            if (current.innerHTML === next.innerHTML && next.innerHTML != "") {
                let mergeValue = (+current.innerHTML) + (+next.innerHTML);
                current.innerHTML = mergeValue;
                cells[j][line].text = mergeValue;
                current.style.backgroundColor = getBackgroundColor(Math.log2(parseInt(mergeValue)));
                next.innerHTML = "";
                cells[j - 1][line].text = 0;
                next.style.backgroundColor = getBackgroundColor(0);
                change = true;
            }
        }

        //下移去空
        for (let i = lines - 1; i > 0; i--) {
            for (let j = i - 1; j >= 0; j--) {
                let current = document.querySelector("#cell_" + i + "_" + line);
                let next = document.querySelector("#cell_" + j + "_" + line);
                if (current.innerHTML === "") {
                    if (next.innerHTML != "") {
                        current.innerHTML = next.innerHTML;
                        cells[i][line].text = +next.innerHTML;
                        current.style.backgroundColor = getBackgroundColor(Math.log2(parseInt(next.innerHTML)));
                        next.innerHTML = "";
                        cells[j][line].text = 0;
                        next.style.backgroundColor = getBackgroundColor(0);
                        change = true;
                    }
                }
            }
        }
    }
};
let judge = () => {
    //所有行无合并元素
    for (let i = 0; i < lines; i++)
        for (let j = 0; j < lines - 1; j++) {
            if (cells[i][j].text == cells[i][j + 1].text)
                return false;
        }
    //所有列无合并元素
    for (let j = 0; j < lines; j++)
        for (let i = 0; i < lines - 1; i++) {
            if (cells[i][j].text == cells[i + 1][j].text)
                return false;
        }
    //无为0的元素
    for (let i = 0; i < lines; i++)
        for (let j = 0; j < lines - 1; j++) {
            if (cells[i][j].text === 0)
                return false;
        }
    gameOver = true;
    return true;
}

//计算两点间的距离
let calcLong = (x1, y1, x2, y2) => {
    return Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
}