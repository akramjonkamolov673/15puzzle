var container = document.getElementById('container'),
    width = 4,
    height = 4,
    matrix,
    els = [],
    elSize = 11,
    msMeter = document.getElementById('msMeter'),
    ms = 0,
    initNow = Date.now(),
    won = false,
    genNew = false,
    alreadyMoved = false,
    won = false;


function init() {

    var num = 0;

    for (var x = 0; x < width; ++x) {

        for (var y = 0; y < height; ++y) {
            ++num;

            if (num === width * height) return;

            var element = document.createElement('div');
            element.className = 'tile';

            element.textContent = num;

            element.addEventListener('click', (function (num) {
                return function () { move(num) }
            })(num))

            els.push(element);

            setElPos(num, x, y);

            container.appendChild(element);
        }
    }

};

function showMs() {
    return ((ms / 10) | 0) / 100;
}

function getRandomItem(ar) {
    return ar[(Math.random() * ar.length) | 0];
}
function startGame() {
    ms = 0;
    running = false;
    won = false;

    var numArr = [];
    for (var i = 0; i < (width * height); ++i) numArr.push(i);

    matrix = [];

    for (var x = 0; x < width; ++x) {

        matrix.push([]);
        for (var y = 0; y < height; ++y) {

            var num = getRandomItem(numArr);
            numArr.splice(numArr.indexOf(num), 1);

            matrix[x].push(num);

            setPos(num, x, y);
        }
    }

    alreadyMoved = false;

    checkFinished();
}

function setPos(num, x, y) {
    if (num === 0) return

    setElPos(num, x, y);
}
function setElPos(num, x, y) {
    var el = els[num - 1];

    el.style.top = (x * elSize) + 'vh';
    el.style.left = (y * elSize) + 'vh';
}
function searchNum(num) {
    for (var i = 0; i < matrix.length; ++i) {

        var index = matrix[i].indexOf(num);

        if (index > -1) {
            return { x: i, y: index }
        }
    }

    return false;
}
function checkFinished() {
    var num = 1,
        is = true;
    for (var i = 0; i < matrix.length; ++i) {

        for (var j = 0; j < matrix[i].length; ++j) {

            if (num === width * height) num = 0;

            if (matrix[i][j] !== num) {
                is = false;

                if (matrix[i][j] !== 0) els[matrix[i][j] - 1].classList.remove('correct');
            } else if (num !== 0) els[num - 1].classList.add('correct');

            ++num;
        }
    }
    return is;
}
function moveZero(num, x, y, nX, nY) {
    matrix[x][y] = 0;
    matrix[nX][nY] = num;

    setPos(num, nX, nY);
}
function getCell(x, y) {
    if (matrix[x]) return matrix[x][y];

    return undefined;
}
function move(num) {
    if (won) return startGame();

    var pos = searchNum(num),
        x = pos.x,
        y = pos.y;

    if (getCell(x, y - 1) === 0) moveZero(num, x, y, x, y - 1);
    else if (getCell(x, y + 1) === 0) moveZero(num, x, y, x, y + 1);
    else if (getCell(x + 1, y) === 0) moveZero(num, x, y, x + 1, y);
    else if (getCell(x - 1, y) === 0) moveZero(num, x, y, x - 1, y);

    if (!running) {
        now = Date.now();

        running = true;

        initMsMeter();
    }

    if (checkFinished()) {
        win();
    }
}

function initMsMeter() {

    if (running) window.requestAnimationFrame(initMsMeter);
    else return 'cheese';

    ms = Date.now() - now;
    msMeter.textContent = showMs();
}
function win() {
    msMeter.textContent = 'YOU WIN! In: ' + showMs();

    won = true;

    running = false;
    console.log(running);
}

function seeSolution() {

    ms = 0;
    running = false;
    won = true;

    var num = 1;

    matrix = [];

    for (var x = 0; x < width; ++x) {

        matrix.push([]);
        for (var y = 0; y < height; ++y) {

            if (num === width * height) break;

            matrix[x].push(num);

            setPos(num, x, y);

            ++num;
        }
    }

    alreadyMoved = false;

    checkFinished();
}

init();
startGame();

document.getElementById('gen').addEventListener('click', startGame);
document.getElementById('see').addEventListener('click', seeSolution);