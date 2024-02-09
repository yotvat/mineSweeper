'use strict'

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
                renderCell(i, j)
                if (!neighbor.minesAroundCount) {
                    expandShown(board, i, j)
                }
                // gGame.shownCount++
            } else continue
        }
    }
}

// function hint(elHint) {
//     if (elHint.innerHTML === '🌕') elHint.innerHTML = '🌑'
//     else elHint.innerHTML = '🌕'



    
// }
