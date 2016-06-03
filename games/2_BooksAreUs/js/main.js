'use strict'

// Your challenge is to build a page that shows a list of books: id, name and price.
//  We will allow the user – a shop owner – to manage the books.
// 1. Create your Model and show the books in a table. We will use a global variable gBooks, 
// and a function renderBooks() that will draw the table
// Now, let's handle CRUD (Create, Read, Update and Delete)
// 2. Add an Actions column to the table (something like this :)

var gBooks = [{
                id: 0,
                name: 'Our Holocaust',
                price: 80,
                deleted: false, 
                img: 'img/Our Holocaust.jpg',
                rate: 0,
                likes: 0,
                dislike: 0
            },
            {
                id: 1,
                name: 'The World a Moment Later',
                price: 70,
                deleted: false,
                img: 'img/The World a Moment Later.jpg',
                rate: 0,
                likes: 0,
                dislike: 0                                
            },
            {
                id: 2,
                name: 'When Heroes Fly',
                price: 100,
                deleted: false,
                img: 'img/When Heroes Fly.jpg',
                rate: 0,
                likes: 0,
                dislike: 0
            }
            ]
            
var gBookIsRead = null;
            
function init () {    
    renderBooks (gBooks, '.tblContainer')
}
            
function  renderBooks(table, selector) {
    var elContainer = document.querySelector(selector);
    var strHTML = '<table class = "myTable" > <tbody>';
    
        strHTML += '<th>'+ 'id' + '</th>'; 
        strHTML += '<th> <button class = "asending" onclick = "sortByName(this)"> ' + 'name' + '</button></th>'; 
        strHTML += '<th> <button class = "asending" onclick = "sortByPrice(this)"> ' + 'price' + '</button> </th>';
        strHTML += '<th>' + 'rate' + '</th>'; 
        strHTML += '<th>' + '' + '</th>'; 
        
         

    for (var i = 0; i < gBooks.length; i++) {
        if (gBooks[i].deleted) continue;
        strHTML += '<tr class="border_bottom">';
        strHTML += '<td>'+ (gBooks[i].id + 1) + '</td>'
        strHTML += '<td>' + gBooks[i].name + ' </td>'
        strHTML += '<td>' + gBooks[i].price + ' </td>'
        strHTML += '<td class = "img_' + gBooks[i].id + '_rate'  + '">' + gBooks[i].rate + ' </td>'
        
        strHTML += ' <td> <div class="buttonsInRowContainer">' + '<button class = "buttonInRow button1" onclick = "showDetails(' + i + ')"> Read </button>'
        strHTML += '<button class = "buttonInRow button2" onclick = "readAndUpdateBook (' + gBooks[i].id + ')"> Update </button>'
        strHTML += '<button class = "buttonInRow button3" onclick = "deleteBook(' + i + ')" > Delete </button>' + '</div> </td> '
        strHTML += '</tr>'
    }

    strHTML += '</tbody></table>';

    elContainer.innerHTML = strHTML;
}
        
// 3. Handle delete - when the button clicked we should call the function deleteBook(bookId))

function deleteBook(bookId) {
    gBooks[bookId].deleted = true;
    document.querySelector('.myTable').deleteRow(gBooks[bookId].id + 1);    
}

// 4. Support adding a new book:
// a. When clicked, call the function readAndAddNewBook() that will read (prompt) the details from the user: name and price, 
// then will call a function addBook(name, price) 
// that will find the next available id and push a new book into the gBooks model. Then call the renderTable() to redraw the table


function readAndAddNewBook()  {
    var elBookName = document.querySelector('#newBookName')
    var elBookPrice = document.querySelector('#newBookPrice') 
    addBook(elBookName.value, elBookPrice.value);
    renderBooks(gBooks, '.tblContainer');
    elBookName.value = null;
    elBookPrice.value = null;
}

function addBook(name, price) {
    var newBook = {
        name: name,
        price: price,
        id: gBooks.length + 1,
        deleted: false,
        rate: 0
        }
    gBooks.push(newBook);
 }

// 5. Support updating a book:
// a. When clicked, call the function: readAndUpdateBook (bookId) that will prompt for the book new price (name never changes) 
// and call the function updateBook(bookId, bookPrice). Then Call the renderTable() to redraw the table
 
function readAndUpdateBook (bookId) {
    var updatedPrice = +prompt ('the new price?');
    gBooks[bookId].price = updatedPrice;
    renderBooks(gBooks, '.tblContainer');
}

// 6. Create an HTML section: Book Details below the table, that shows the details of a selected book including its photo (based on its id)
// a. When read is clicked, update the section to show the details of the selected book.
// b. Add a rate property for the book, set 0 as default, the rate should be a number between 0 and 10.
// c. In the Book Details, allow the user to change the rate of the book by clicking a Thumb up or Thumb down button.

function showDetails(bookId) {
    gBookIsRead = gBooks[bookId];
    var elbookDetailsContainer = document.querySelector ('.bookDetailsContainer');
    elbookDetailsContainer.style.visibility = 'visible';
    var elImgContainer = document.querySelector('.imgContainer')
    elImgContainer.innerHTML = '<img src="' + gBookIsRead.img + '" >';
} 

function closePopup() {
    var elbookDetailsContainer = document.querySelector ('.bookDetailsContainer');
    elbookDetailsContainer.style.visibility = 'hidden'; 
}

function addLike() {
    gBookIsRead.rate++;
    var elRate = document.querySelector('.img_' + gBookIsRead.id + '_rate');    
    elRate.innerHTML++;
}

function addDislike() {
    gBookIsRead.rate--;
    var elRate = document.querySelector('.img_' + gBookIsRead.id + '_rate');    
    elRate.innerHTML--;
}

function sortByPrice(value) {
    gBooks.sort ((function(a, b){
        return a.price > b.price
    }))        
    renderBooks(gBooks, '.tblContainer');
}

function sortByName() {    
    gBooks.sort ((function(a, b){
        return a.name > b.name
    }))        
    renderBooks(gBooks, '.tblContainer');
}

