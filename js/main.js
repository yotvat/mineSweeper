'use strict'
const SMILEY = '😃'
const WIN_SMILEY = '🤑'
const WORRY = '😰'
const SOON_DEAD = '🤢'
const LOSE_SMILY = '💀'
const MINE = '💣'
const MARK = '🚩'
const CELL = ''
const elBoard = document.querySelector('.board')
var gClickes = 0
var gLives = 3
const elLive = document.querySelector('.live')
elLive.innerText = `lives : ${gLives}`
const elSmileyButton = document.querySelector('.smiley')




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
    setMinesNegsCount(gBoard)

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
    // board[0][2].isMine = board[2][1].isMine = true
    //RANDOMIZING
    // board[getRandomIntInclusive(0, size - 1)][getRandomIntInclusive(0, size - 1)].isMine =
    //     board[getRandomIntInclusive(0, size - 1)][getRandomIntInclusive(0, size - 1)].isMine = true
    return board
}

function rednerBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            strHTML += `\t<td class="cell ${i} ${j}" onclick="onCellClicked(this,${i},${j})" >\n`
            // if (currCell.isMine === true) {
            //     strHTML += MINE
            //     // console.log('hi');
            // } else
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
    // var mineCount = 0 
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
                        // console.log(r, c, neighbor);
                    }
                }
            }

        }
    }
}

function onCellClicked(elCell, i, j) {

    gClickes++
    var currCell = gBoard[i][j]
    console.log(`this is the ${gClickes} click`);
    if (gClickes === 1 ) {
  
        gBoard[0][2].isMine = gBoard[2][1].isMine = true
        //MODEL
        rednerBoard(gBoard)
        setMinesNegsCount(gBoard)
    }
    //DOM
    elCell.innerHTML = currCell.minesAroundCount

    //ADD LIFE
    if (currCell.isMine) {
        elCell.innerHTML = ''
        --gLives
        console.log('you clicked a mine');
        elLive.innerText = `you have ${gLives} lives!!!!`
        if (gLives === 2) elSmileyButton.innerHTML = WORRY
        else if (gLives === 1) elSmileyButton.innerHTML = SOON_DEAD
        else if (gLives === 0) elSmileyButton.innerHTML = LOSE_SMILY
    }





}

function onCellMarked(elCell) {

}

function checkGameOver() {
if(gLives===0){


}
}


function expandShown(board, elCell, i, j) {

}

function restart() {
    gClickes = 0
    gLives = 3
    elLive.innerText = `lives : ${gLives}`
    onInit()
}