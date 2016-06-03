'use strict'

var gBoard = [];
var MINES = '&#x1F4A3;';
var EMPTY = ' ';
var MARKED = '&#127937;';

var gTimePassed = 0;
var gSecsInterval;
var gLevelSelected;
var gLevel = [{ 
                size: 9, 
                mines: 10 
            },
            { 
                size: 14, 
                mines: 40 
            },
            { 
                size: 17, 
                mines: 50 
            }
            ];
var gState = {
                shownCount: 0, 
                markedCount: 0
            }


function initGame() {    
    if (localStorage.getItem('level')) {
        gLevelSelected = gLevel[localStorage.getItem('level')];
        gBoard = [];
        buildBoard(); 
    }
       
    renderBoard(gBoard, '.boardContainer');
    updateMinesMarked()
}


function updateTime() {
    var elSpanTimer = document.getElementById('spanTimer');
    elSpanTimer.innerText = gTimePassed / 10;
}


function updateMinesMarked() {
    var elSpanMines = document.getElementById('spanMinesCounter');
    elSpanMines.innerText = gLevelSelected.mines - gState.markedCount;
}


function buildBoard() {
    for (var i = 0; i < gLevelSelected.size; i++) {        
        gBoard.push([]);   
        
        for (var j = 0; j < gLevelSelected.size; j++) {
            gBoard[i][j] = EMPTY;
            
        }
    }
    
    for (var index = 0; index < gLevelSelected.mines; index++) {
        var i = (parseInt(Math.random() * gLevelSelected.size));
        var j = (parseInt(Math.random() * gLevelSelected.size));
        
        if (gBoard[i][j] === MINES) {
            index--;            
            continue; 
        } else gBoard[i][j] = MINES;
    }
    
    for (var i = 0; i < gBoard.length; i++) {
        
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j] !== MINES) {
                gBoard[i][j] = setMinesNegsCount(i, j); 
                
                if (gBoard[i][j] === 0) gBoard[i][j] = EMPTY;
            }
        }
    }
    console.table(gBoard);      
}
    

function setMinesNegsCount(i, j) {
    var count = 0;
    
    for (var a = i-1; a <= i+1; a++) {
        if ( a < 0 || a >= gBoard.length ) continue;
        
        for (var b = j-1; b <= j+1; b++) {
            if ( b < 0 || b >= gBoard.length ) continue;
            if ( a === i && b === j ) continue;
            if (gBoard[a][b] === MINES) count++;
        }
    }   
  return count;
}


function renderBoard(mat, selector) {
    var elContainer = document.querySelector(selector);
    var strHTML = '<table> <tbody>';
    
    mat.forEach (function (row, i) {
        strHTML += '<tr>';
        row.forEach(function (cell, j) {
            var className = 'cell cell_' + i + '_' + j;
            strHTML += '<td class="' + className + ' " onclick = "cellClicked(this)" oncontextmenu = "cellMarked(this)" ></td>'
        //  ' + i + j + 
            });    
        strHTML += '</tr>'
  })
  
    strHTML += '</tbody></table>';
    elContainer.innerHTML = strHTML;    
}


function startTimer () {
    if (!gSecsInterval) {
        gSecsInterval = setInterval(function () {
        gTimePassed++;
        updateTime();
        }, 100)        
    }
}


function cellClicked (elCell, i, j) {    
    gState.shownCount++;     
    i = getElementIndex(elCell)[0];
    j = getElementIndex(elCell)[1];        
    startTimer ()
    elCell.innerHTML = gBoard[i][j];   
    elCell.classList.add('marked');             
    expandShown (gBoard, elCell, i, j);   
    paintNumber (gBoard, elCell, i, j)
    checkGameOver(gBoard ,i, j);
}


function expandShown (board, elCell, i, j) {   
    if (board[i][j] === EMPTY) {
        
        for (var a = i-2; a <= i+2; a++) { 
                       
            for (var b = j-2; b <= j+2; b++) {
                elCell = document.querySelector('.cell_' + a + '_' + b); 
                
                if ( a < 0 || a >= board.length ) continue;  
                if ( b < 0 || b >= board.length ) continue;
                if ( a === i && b === j ) continue;
                if (board[a][b] >= 0 && elCell.style.backgroundColor !== 'white') {
                    gState.shownCount++;
                    paintNumber (gBoard, elCell, a, b);
                    elCell.innerHTML = gBoard[a][b];  
                    elCell.classList.add('marked');             
                }
            }
        } 
    }
    
    if (board [i][j] === MINES) {
        elCell = document.querySelector('.cell_' + i + '_' + j);  
        elCell.style.backgroundColor = 'red'; 
                     
        for (var a = 0; a < board.length; a++) { 
             
            for (var b = 0; b < board[a].length; b++) {
                
                if ( a === i && b === j ) continue;
                if (board [a][b] === MINES) {
                    elCell = document.querySelector('.cell_' + a + '_' + b);  
                    elCell.innerHTML = gBoard[i][j]; 
                    elCell.classList.add('marked');              
                }
            }
        }
    }
  return board;
}


function cellMarked(elCell) {
   document.body.oncontextmenu = function() {
       return false }
       
   elCell.style.backgroundColor = 'lightsalmon';
   elCell.style.pointerEvents = 'none'; 
   elCell.innerHTML = MARKED;
    
    var i = getElementIndex(elCell)[0];
    var j = getElementIndex(elCell)[1];
    
   gBoard[i][j] = MARKED;
   gState.markedCount++;  
   
   updateMinesMarked();
   checkGameOver(gBoard ,i, j);
}
    

function checkGameOver(board, i, j) {
    var isGameOver = false;
    
    if (board[i][j] === MINES && board[i][j] !== MARKED) {
        isGameOver = true;
        alert ('GAME OVER');
    } 
    
     if (gState.shownCount === (Math.pow(gLevelSelected.size, 2) - gLevelSelected.mines) &&
        gState.markedCount === gLevelSelected.mines) {
        isGameOver = true;
        alert('Congratulations! you won! time: ' + gTimePassed/10);
    }
    
     if (isGameOver) {
        clearInterval(gSecsInterval); 
        window.location = "index.html";
     }   
    return isGameOver;
}


function getElementIndex (elCell) {
   var cells = elCell.classList;
   var cellsClass = cells[1].substring(5)
   var cellsIndex = cellsClass.split('_')
   cellsIndex = [+cellsIndex[0], +cellsIndex[1]]
   return cellsIndex;
}


function paintNumber (board, elCell, i, j) {
    switch (board[i][j]) {
        case 1:
            elCell.style.color = 'blue';
            break;
        case 2:
            elCell.style.color = 'green';
            break;
        case 3:
            elCell.style.color = 'red';
            break;
        case 4:
            elCell.style.color = 'black';
            break;
        case 5:
            elCell.style.color = 'pink';
            break;
        case 6: 
            elCell.style.color = 'purple';
            break;            
        case 7:
            elCell.style.color = 'orange';
            break;
        case 8:
            elCell.style.color = 'darkblue';
            break;
    }
}


function startAgain() {
    clearInterval(gSecsInterval); 
   initGame(); 
}


