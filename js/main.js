'use strict'

const MINE = '💣'
const MARK = '🚩'
const CELL = ''
const elBoard = document.querySelector('.board')





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
    board[0][2].isMine = board[2][1].isMine = true
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
            if (currCell.isMine === true) {
                strHTML += MINE
                console.log('hi');
            } else if (currCell.isMarked === true) {
                strHTML += MARK
            } else if (currCell.minesAroundCount) {
                // strHTML += currCell.minesAroundCount
            }
            strHTML += '\t</td>\n'

        }
        strHTML += '</tr>\n'
    }
    // console.log('trying to rnder');
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
    rednerBoard(board)
}

function onCellClicked(elCell, i, j) {
    elCell.innerHTML = gBoard[i][j].minesAroundCount
    // console.log(gBoard[i][j].minesAroundCount);


}

function onCellMarked(elCell) {

}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}


