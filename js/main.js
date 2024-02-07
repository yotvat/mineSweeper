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
    // setMinesNegsCount(gBoard)

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
            strHTML += `\t<td class="marked cell ${i} ${j}" onclick="onCellClicked(this,${i},${j})" onclick="onCellMarked(this)" >\n`
            // if (currCell.isMine === true) {
                //     strHTML += MINE
                //     // console.log('hi');
                // } else
                // if (currCell.isMarked === true) {
                    //     strHTML += MARK
                    // }
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
    var currCell = gBoard[i][j]
    gClickes++
    console.log('gClicks',gClickes);

    // console.log(`this is the ${gClickes} click`);
    if (gClickes === 1) {
        for (var i = 0; i < gLevel.MINES; i++) {
            gBoard[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)].isMine = true
            

        }
        //MODEL
        setMinesNegsCount(gBoard)
        // rednerBoard(gBoard)
    }
    //DOM
    elCell.innerHTML = currCell.minesAroundCount
// handleReveal(i,j)
    //ADD LIFE
    if (currCell.isMine) {
        elCell.innerHTML = MINE
        gLives--
        console.log('you clicked a mine');
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

function onCellMarked(elCell) {
    elCell.isMarked = true
}

function checkGameOver() {
    //if loss
    if (gLives === 0) {
        console.log('gameover');
        elLive.innerText = 'game over!! you lost!  press the smiley to restart'
        setTimeout(restart, 3000)
    }
}

function expandShown(board, elCell, i, j) {

}

// function handleReveal(i,j){
//     var currCell= gBoard[i][j]
// if (currCell.minesAroundCount===0){
//     var rowIdx = i
//     var colIdx = j
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (i === rowIdx && j === colIdx) continue
//             if (j < 0 || j >= gBoard[0].length) continue
//             if(gBoard[i][j].minesAroundCount===0){
//                 console.log('setting');
//                 console.log(i,j);
//                 // gBoard[i][j].innerHTML = gBoard[i][j].minesAroundCount





//             }
//         }
//     }
// }
// }

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


// document.addEventListener('contextmenu',e  => {
//     e.preventDefault()
//     gBoard[1][3].isMarked = true
//     console.log(gBoard[1][3]);
    
//     console.log('RIGHT CLICKEDs');
// })

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