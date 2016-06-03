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
        console.log(gLevelSelected);
        gBoard = [];
        buildBoard(); 
    }
    renderBoard(gBoard, '.boardContainer');
    updateMinesMarked();
    updateTime();
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
                gBoard[i][j] = getMinesNegsCount(i, j); 
                
                if (gBoard[i][j] === 0) gBoard[i][j] = EMPTY;
            }
        }
    }
    console.table(gBoard);      
}
    

function getMinesNegsCount(i, j) {
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
            strHTML += '<td class="' + className + ' " onclick = "cellClicked(this,' + i +',' + j + ')" oncontextmenu = "cellMarked(this, ' + i +',' + j + ')" ></td>'
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
    startTimer ();
    elCell.innerHTML = gBoard[i][j];   
    elCell.classList.add('open');             
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
                if (board[a][b] >= 0 && !elCell.classList.contains('open')) {
                    gState.shownCount++;
                    paintNumber (gBoard, elCell, a, b);
                    elCell.innerHTML = gBoard[a][b];  
                    elCell.classList.add('open');             
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
                    elCell.classList.add('open');              
                }
            }
        }
    }
  return board;
}


function cellMarked(elCell, i, j) {
   document.body.oncontextmenu = function() {
       return false }
   elCell.classList.add('marked');              
   elCell.innerHTML = MARKED;   
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


function paintNumber (board, elCell, i, j) {
    var colorsToPaint = ['white', 'blue', 'green', 'red', 'black', 'pink', 'purple'];
        elCell.style.color = colorsToPaint[gBoard[i][j]];
        console.log('colorsToPaint[gBoard[i][j]]', colorsToPaint[gBoard[i][j]], 'gBoard[i][j]', gBoard[i][j]);
}


function startAgain() {
    clearInterval(gSecsInterval); 
    gSecsInterval = false;
    gTimePassed = 0;
    gState = {
                shownCount: 0, 
                markedCount: 0
            }
   initGame(); 
}


