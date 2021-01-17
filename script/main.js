const display = document.querySelector('#display');

let myLibrary = [];

function book (title="unknown", author="unknown", pages="0", read="false"){
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
}

function addBookToLibrary (newBook){
    if(myLibrary.some((book) => book.title === newBook.title)) return false;
    myLibrary.push(newBook);
    saveLocal();
    return true;
}

function removeFromLibrary(bookTitle) {
    myLibrary = myLibrary.filter((book) => book.title !== bookTitle);
    saveLocal();
}

function getBook(bookTitle) {
    for (let book of myLibrary) {
      if (book.title === bookTitle) {
        return book;
      }
    }
    return null;
  }


//POPUP FORM
const newBookBtn = document.querySelector('#newBook');
const popup = document.querySelector('.content');
const overlay = document.querySelector('.overlay');
const form = document.querySelector('.content_form');


newBookBtn.addEventListener('click', openPopup);
overlay.addEventListener('click', closePopup);


function openPopup() {
    form.reset();
    popup.classList.add('content-active');
    overlay.classList.add('overlay-active');
}

function closePopup() {
    popup.classList.remove('content-active');
    overlay.classList.remove('overlay-active');
}

// FORM
form.addEventListener("submit", addBook);

function addBook(e){
    e.preventDefault();
    if(addBookToLibrary(getBookFromInput())){
        updateGrid();
        saveLocal();
        closePopup();
    }else{
        alert("Este libro ya fue agregado");
    }
}

function getBookFromInput(){
    const title = `"${document.querySelector('#title').value}"`;
    const author = document.querySelector('#author').value;
    const pages = document.querySelector('#pages').value;
    const read = document.querySelector('#read').checked;
    return new book(title, author, pages, read);
}



// BOOKS CARD

const booksGrid = document.querySelector('.grid');
booksGrid.addEventListener("click", checkBooksGridInput);

function checkBooksGridInput(e) {
  if (e.target.classList.contains("removeBtn")) {
    removeFromLibrary(e.target.parentNode.firstChild.innerHTML);
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
  } else if (e.target.classList.contains("readBtn")) {
    if (e.target.innerHTML === "Leído") {
      getBook(e.target.parentNode.firstChild.innerHTML).read = false;
      e.target.innerHTML = "Sin leer";
      e.target.classList.remove("readBtn-isRead");
      e.target.classList.add("readBtn-notRead");
      saveLocal();
    } else {
      getBook(e.target.parentNode.firstChild.innerHTML).read = true;
      e.target.innerHTML = "Leído";
      e.target.classList.remove("readBtn-notRead");
      e.target.classList.add("readBtn-isRead");
      saveLocal();
    }
  }
}



function updateGrid() {
    resetGrid();
    for(let element of myLibrary) {
        createGrid(element);
    }
}

function resetGrid(){
    booksGrid.innerHTML = "";
}

function createGrid(book) {
    const bookCard = document.createElement('div');
    const title = document.createElement('h3');
    const author = document.createElement('h3');
    const pages = document.createElement('h3');
    const readBtn = document.createElement('button');
    const removeBtn = document.createElement('button');

    bookCard.classList.add('book-card');
    title.classList.add('book-card-title');
    author.classList.add('book-card-autho');
    pages.classList.add('book-card-pages');
    readBtn.classList.add('btnGeneral');
    readBtn.classList.add('readBtn');
    removeBtn.classList.add('btnGeneral');
    removeBtn.classList.add('removeBtn');



    title.textContent = book.title;
    author.textContent = book.author;
    pages.textContent = `${book.pages} pages`;
    removeBtn.textContent = "Eliminar";
    if (book.read){
        readBtn.textContent = "Leído";
        readBtn.classList.add('readBtn-isRead');
    }else{
        readBtn.textContent = "Sin leer";
        readBtn.classList.add('readBtn-notRead');
    }

    bookCard.appendChild(title);
    bookCard.appendChild(author);
    bookCard.appendChild(pages);
    bookCard.appendChild(readBtn);
    bookCard.appendChild(removeBtn);
    booksGrid.appendChild(bookCard);
}


function saveLocal() {
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  }

//pulls books from local storage when page is refreshed
// function localStorage() {
//     if (localStorage.getItem("myLibrary")) {
//       myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
//     } else {
//       myLibrary = DEFAULT_DATA;
//     }
// }

function restoreLocal() {
    myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
    
    if (myLibrary === null) myLibrary = [];
    updateGrid();
}

restoreLocal(); 

// localStorage();