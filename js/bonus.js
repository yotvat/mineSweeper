'use strict'
const elBody = document.querySelector('body')
var gIsHint
var gSafeClicksCount = 3
var elSafeClick = document.querySelector('.safe-click')


function handleDarkMode(elBtn) {
    elBody.classList.toggle('dark-mode')
    if (elBtn.innerHTML === 'LIGHT MODE') elBtn.innerHTML = 'DARK MODE'
    else elBtn.innerHTML = 'LIGHT MODE'
}

function expandShown(board, rowIdx, colIdx) {
    var i = rowIdx
    var j = colIdx
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var neighbor = board[i][j]
            if (!neighbor.isShown) {
                neighbor.isShown = true
                gGame.shownCount++
                renderCell(i, j)
                if (!neighbor.minesAroundCount) {
                    expandShown(board, i, j)
                }
            } else continue
        }
    }
}

function safeClick(elBtn) {
    if (gSafeClicksCount>0) {
        var emptyPositions = getEmptyPos(gBoard)
        var randCellIdx = getRandomInt(0, emptyPositions.length)
        var safeClickCellIdx = emptyPositions[randCellIdx]
        var currCell = gBoard[safeClickCellIdx.i][safeClickCellIdx.j]
        var elCell = document.querySelector(`td.cell.cell-${safeClickCellIdx.i}-${safeClickCellIdx.j}`)
        elCell.style.color = 'green'
        elCell.innerHTML = currCell.minesAroundCount
        gSafeClicksCount--
        elBtn.innerHTML = `Safe clicks: ${gSafeClicksCount}`
       if(gSafeClicksCount <= 0) {
        elBtn.innerHTML = '⛔️'
        gSafeClicksCount = 3
       }
    } else {
        elBtn.innerHTML = `Safe clicks: ${gSafeClicksCount}`
        return
    }
}
