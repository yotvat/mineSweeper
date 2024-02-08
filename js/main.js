'use strict'
const SMILEY = '😃'
const WIN_SMILEY = '🤑'
const WORRY = '😰'
const SOON_DEAD = '🤢'
const LOSE_SMILY = '💀'
const MINE = '💣'
const MARK = '🚩'
const CELL = ''
var gMarksCount = 3
var gClickes
var gLives = 3
const elBoard = document.querySelector('.board')
const elLive = document.querySelector('.live')
const elSmileyButton = document.querySelector('.smiley')
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
    gClickes = 0
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            strHTML += `\t<td class="cell cell-${i}-${j}" onclick="onCellClicked(this,${i},${j})" oncontextmenu= "onCellMarked(this,event,${i},${j})">\n`
            if (currCell.isMine === true) {
                strHTML += MINE
                // console.log('hi');
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

function renderCell(i, j) {
    //update DOM to current cell state
    var currCell = gBoard[i][j]
    if (!currCell.isShown)
        return
    // var idx= i*gBoard.length+j
    // // var elCell = elBoard.querySelectorAll(`td.cell`)[idx]
    var elCell = document.querySelector(`td.cell.cell-${i}-${j}`)


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
    // console.log(elCell);
    //only after first click place mines
    gClickes++
    var currCell = gBoard[i][j]
    // KNOWS console.log(currCell);
    //  KNOWS console.log(i, j);
    currCell.isShown = true
    //  KNOWS console.log(currCell);
    //  KNOWS console.log(i, j);
    //to change!
    // console.log('you pressed',i,j);
    if (gClickes === 1) {
        // console.log('hi');
        for (var idx = 0; idx < gLevel.MINES; idx++) {
            var randIdxI = getRandomInt(0, gLevel.SIZE)
            var randIdxJ = getRandomInt(0, gLevel.SIZE)
            // console.log(randIdxI, randIdxJ);
            if (randIdxI === i && randIdxJ === j) {
                gBoard[randIdxI][randIdxJ].isMine = false
                // console.log('replacing mine')
            } else {
                gBoard[randIdxI][randIdxJ].isMine = true
            }
        }
        // for (var i = 0; i < gLevel.MINES; i++) {
        //     gBoard[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)].isMine = true
        //MODEL   
        setMinesNegsCount(gBoard)
        // rednerBoard(gBoard)
    }
    //DOM
    // renderCell
    elCell.innerHTML = currCell.minesAroundCount

    if (currCell.minesAroundCount === 0 && !currCell.isMine) {
        console.log('i have zero neighbors');
        expandShown(gBoard, i, j)
    }

    //ADD LIFE
    if (currCell.isMine) {
        elCell.innerHTML = MINE
        gLives--
        // console.log('you clicked a mine');
        elLive.innerText = `you have ${gLives} lives!!!!`
        if (gLives === 2) elSmileyButton.innerHTML = WORRY
        else if (gLives === 1) elSmileyButton.innerHTML = SOON_DEAD
        else if (gLives === 0) elSmileyButton.innerHTML = LOSE_SMILY
    } else {
        currCell.isShown = true
        gGame.shownCount++
    }
    //check game over
    checkGameOver()
}
function onCellMarked(elCell, ev, i, j) {
    ev.preventDefault()
    console.log('marking');
    var currCell = gBoard[i][j]
    //model
    currCell.isMarked = true
    // console.log(currCell);

    //dom
    elCell.innerHTML = MARK

}

function checkGameOver() {
    //if loss
    if (gLives === 0) {
        console.log('gameover');
        elLive.innerText = 'game over!! you lost!  press the smiley to restart'
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                gBoard[i][j].isShown = true
                renderCell(i, j)
            }
        }
        setTimeout(restart, 6000)
    } //else {
    // if win
    //     for (var i = 0; i < gBoard.length; i++) {
    //         for (var j = 0; j < gBoard[0].length; j++) {
    //             if (gBoard[i][j].isMine && gBoard[i][j].isMarked) {
    //                 console.log('supposed to win');
    //                 console.log(gBoard[i][j]);


    //                 // renderCell(i, j)
    //             }
    //         }
    //         // setTimeout(restart, 6000)
    //     }
    // }
}

function expandShown(board,rowIdx, colIdx) {
    // console.log(rowIdx, colIdx, elCell);// brings back MODEL ELEMENT.!
    // console.log(rowIdx,colIdx,board[rowIdx][colIdx]);// same
    console.log('you clicked',rowIdx, colIdx);
    var i = rowIdx
    var j = colIdx
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var neighbor = board[i][j]
            // console.log('neighbors:',neighbor,i,j);
            neighbor.isShown = true
            renderCell(i,j)
            
        }
    }
    // for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    //     if (i < 0 || i >= board.length) continue
    //     for (var j = colIdx - 1; j <= colIdx + 1; j++) {
    //         if (i === rowIdx && j === colIdx) continue
    //         if (j < 0 || j >= board[0].length) continue
    //         var neighbor = board[i][j]
    // console.log(neighbor , i , j);
    // neighbor.isShown = true
    // renderCell(i, j)

    // // console.log('neighbor i, j',neighbor,i, j);
    // console.log('currCell',currCell);
    // console.log(neighbor.isShown);
    // console.log(neighbor.isShown);
    // console.log('neighbor i, j',neighbor,i, j);




    //     }
    // }

}

function restart() {
    gClickes = 0
    gLives = 3
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

// not working -figure out why
// function setMinesNegsCount(board) {
//     // var mineCount = 0 
//     for (var i = 0; i < board.length; i++) {
//         for (var j = 0; j < board[0].length; j++) {
//             var currCell = board[i][j]
//             var rowIdx = i
//             var colIdx = j   
//             // console.log(rowIdx,colIdx);

//         }
//     }
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i >= board.length) continue
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (i === rowIdx && j === colIdx) continue
//             if (j < 0 || j >= board[0].length) continue
//             console.log('i,j',i,j)
//             var neighbor = board[rowIdx][colIdx]  
//             console.log(neighbor);

//             // if(neighbor.isMine){
//             //     console.log('mine');
//             // neighbor.minesAroundCount++
//             // console.log(i,j,neighbor);
//             // }
//         }

//     }
// }