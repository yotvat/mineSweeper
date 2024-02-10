'use strict'
const SMILEY = '😃'
const WORRY = '😰'
const SOON_DEAD = '🤢'
const LOSE_SMILY = '💀'
const MINE = '💣'
const MARK = '🚩'
const CELL = ''
var gClickes
var gLives = 3
var gMarkedMines = 0
var gTimerInterval
const elBoard = document.querySelector('.board')
const elLive = document.querySelector('.live')
const elSmileyButton = document.querySelector('.smiley')
const currScore = document.querySelector('h4 span')
elLive.innerText = `lives : ${gLives}`
elLive.style.fontFamily = 'Copperplate, Papyrus, fantasy'

//MODEL
var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    gBoard = buildBoard()
    rednerBoard(gBoard)
    gGame.isOn = true
}

function buildBoard() {
    const size = gLevel.SIZE
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function rednerBoard(board) {
    gClickes = 0
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            strHTML += `\t<td class="cell cell-${i}-${j}" onclick="onCellClicked(this,${i},${j})" oncontextmenu= "onCellMarked(this,event,${i},${j})">\n`
            if (currCell.isMine === true) {
                strHTML += MINE
            } else
                if (currCell.isMarked === true) {
                    strHTML += MARK
                }
            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var rowIdx = i
            var colIdx = j
            if (currCell.isMine) {
                //change neighbors properties
                for (var r = rowIdx - 1; r <= rowIdx + 1; r++) {
                    if (r < 0 || r >= board.length) continue
                    for (var c = colIdx - 1; c <= colIdx + 1; c++) {
                        if (r === rowIdx && c === colIdx) continue
                        if (c < 0 || c >= board[0].length) continue
                        var neighbor = board[r][c]
                        neighbor.minesAroundCount++
                    }
                }
            }
        }
    }
}

function renderCell(i, j) {
    //update DOM to current cell state
    var elCell = document.querySelector(`td.cell.cell-${i}-${j}`)
    var currCell = gBoard[i][j]
    if (!currCell.isShown) return

    if (currCell.isMine) {
        elCell.innerHTML = MINE
        return
    }
    if (currCell.minesAroundCount >= 0) {
        elCell.innerHTML = currCell.minesAroundCount
        return
    }
    if (currCell.isMarked) {
        elCell.innerHTML = MARK
        return
    }
    return;
}

function onCellClicked(elCell, i, j) {
    //only after first click place mines
    gClickes++
    gGame.shownCount++
    var currCell = gBoard[i][j]
    if (currCell.isShown === false) currCell.isShown = true
    if (gClickes === 1) {
        startTimer()
        var minesPlaced = 0
        while (minesPlaced != gLevel.MINES) {
            var randIdxI = getRandomInt(0, gLevel.SIZE)
            var randIdxJ = getRandomInt(0, gLevel.SIZE)
            var randCell = gBoard[randIdxI][randIdxJ]
            if (!randCell.isMine && (randIdxI !== i || randIdxJ !== j)) {
                randCell.isMine = true
                minesPlaced++
            }
        }
        //MODEL   
        setMinesNegsCount(gBoard)
    }
    //DOM
    elCell.innerHTML = currCell.minesAroundCount

    if (!currCell.isMine && currCell.minesAroundCount) {
    }
    if (currCell.minesAroundCount === 0 && !currCell.isMine) {
        expandShown(gBoard, i, j)
    }

    //ADD LIFE
    if (currCell.isMine) {
        elCell.innerHTML = MINE
        gLives--
        gGame.isShown--
        elLive.innerText = `you have ${gLives} lives!!!!`
        if (gLives === 2) elSmileyButton.innerHTML = WORRY
        else if (gLives === 1) elSmileyButton.innerHTML = SOON_DEAD
        else if (gLives === 0) elSmileyButton.innerHTML = LOSE_SMILY
    }
    checkGameOver()
}

function onCellMarked(elCell, ev, i, j) {
    ev.preventDefault()
    var currCell = gBoard[i][j]
    if(currCell.isShown) return
    if (currCell.isMarked) {
        currCell.isShown = false
        currCell.isMarked = false
        elCell.innerHTML = CELL
    }else{

        //model
        currCell.isMarked = true
        if (currCell.isMine) gMarkedMines++
        checkGameOver()
        //dom
        elCell.innerHTML = MARK
    }

}

function checkGameOver() {
    //win
    if (gMarkedMines === gLevel.MINES || gGame.shownCount === ((gLevel.SIZE * gLevel.SIZE) - gLevel.MINES)) {
        elLive.innerHTML = 'YOU WON!! AMAZING! press the smiley to restart'
        clearInterval(gTimerInterval)
        //SAVE THE SCORE
        // if (localStorage) {
        //     localStorage.setItem('currentScore', score);
        //     var currHighScore = localStorage.getItem('currentScore')
        //     console.log(currHighScore);

        //     // currScore.innerHTML = currHighScore.innerText
        //     // console.log('setting score');

        // }

        gGame.isOn = false
        // setTimeout(restart, 3500)
        //lose
    } else if (gLives === 0) {
        console.log('gameover');
        elLive.innerText = 'game over!! you lost!  press the smiley to restart'
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                gBoard[i][j].isShown = true
                renderCell(i, j)
            }
        }
        gGame.isOn = false
        clearInterval(gTimerInterval)
        // setTimeout(restart, 2500)
    }

}

//FULL EXPAND ON bonus.js
// function expandShown(board, rowIdx, colIdx) {
//     var i = rowIdx
//     var j = colIdx
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i >= board.length) continue
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (i === rowIdx && j === colIdx) continue
//             if (j < 0 || j >= board[0].length) continue
//             var neighbor = board[i][j]
//             if (!neighbor.isShown) {
//                 neighbor.isShown = true
//                 renderCell(i, j)
//                 // gGame.shownCount++
//             } else continue
//         }
//     }
// }

function restart() {
    clearInterval(gTimerInterval)
    document.querySelector('h3 span').innerText = 0
    gClickes = 0
    gLives = 3
    gMarkedMines = 0
    gGame.shownCount = 0
    elLive.innerText = `lives : ${gLives}`
    elSmileyButton.innerHTML = SMILEY
    onInit()
}

function onSizeClick(size = 4) {
    gLevel.SIZE = size
    if (gLevel.SIZE === 8) {
        gLevel.MINES = 14
    } else if (gLevel.SIZE === 12) {
        gLevel.MINES = 32
    } else if (gLevel.SIZE === 4) {
        gLevel.MINES = 2
    }
    restart()
}

function startTimer() {
    if (gTimerInterval) clearInterval(gTimerInterval)
    gTimerInterval = setInterval(() => {
        document.querySelector('h3 span').innerText++
    }, 1000)
}
