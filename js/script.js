// Getting Dom Elements Reference
let noteBooksEl = document.getElementById("list");
let noteBookItems = document.querySelectorAll(".list-item");
let notesEl = document.getElementById("notes");
let addNoteEl = document.getElementById("new-note");
let addNoteBookEl = document.getElementById("new-notebook");
let newNoteSubmit = document.getElementById("new-note-submit");
let newNoteCancel = document.getElementById("new-note-cancel");
let newBookSubmit = document.getElementById("new-book-submit");
let newBookCancel = document.getElementById("new-book-cancel");
let newNoteModal = document.getElementById("new-note-modal");
let newBookModal = document.getElementById("new-book-modal");
let overlayEl = document.getElementById("overlay");
let newBookNameEl = document.getElementById("new-book-name");
let noteBookTitle = document.getElementById("notebook-title");
let noteTitleEl = document.getElementById("note-title-text");
let noteContentEl = document.getElementById("note-text");
let binEl = document.getElementById("bin");
let deleteButton = document.getElementById("delete-notebook");

window.addEventListener("DOMContentLoaded", displayDataFromLocalStorage);

async function displayDataFromLocalStorage(selectNote, noteBookItem) {
  noteBooksEl.innerHTML = "";
  let noteBooks = await fetchDataFromLocalStorage();
  noteBooks.forEach((noteBook) => {
    let listItem = `<li class="list-item">${noteBook.name}</li>`;
    noteBooksEl.innerHTML += listItem;
  });
  noteBookItems = document.querySelectorAll(".list-item");
  handleAttachEvent(noteBookItems);
  if (selectNote !== "NO") {
    setSelectedNote();
  } else {
    setSelectedNote(noteBookItem.innerText);
  }
}

deleteButton.addEventListener("click", handleAttachDelete);

function handleAttachDelete() {
  noteBookItems = document.querySelectorAll(".list-item");
  noteBookItems.forEach((noteBook) => {
    if (noteBook.classList.contains("active")) {
      let noteBookName = noteBook.innerText;

      let noteBooks = fetchDataFromLocalStorage();
      let newNoteBooks = noteBooks.filter((noteBook) => {
        return noteBook.name !== noteBookName;
      });
      localStorage.setItem("noteBooks", JSON.stringify(newNoteBooks));
      displayDataFromLocalStorage();
    }
  });
}

function handleAttachEvent(noteBookItems) {
  noteBookItems.forEach((noteBookEl) => {
    let noteBookName = noteBookEl.innerText;
    noteBookEl.addEventListener("click", function () {
      setSelectedNote(noteBookName);
    });
  });
}

function fetchDataFromLocalStorage() {
  let noteBooks = JSON.parse(localStorage.getItem("noteBooks")) || [];
  return noteBooks;
}

function setSelectedNote(noteId) {
  if (noteId) {
    noteBookItems = document.querySelectorAll(".list-item");
    noteBookItems.forEach((noteBookItem) => {
      if (noteBookItem.innerText === noteId) {
        noteBookItem.classList.add("active");
      } else {
        noteBookItem.classList.remove("active");
      }
    });
    noteBookTitle.innerText = noteId;

    DisplayNotes(noteId);
  } else {
    if (document.getElementsByClassName("list-item")[0]) {
      let noteBookName =
        document.getElementsByClassName("list-item")[0].innerText;
      document.getElementsByClassName("list-item")[0].classList.add("active");
      noteBookTitle.innerText = noteBookName;
      DisplayNotes(noteBookName);
    }
  }
}

async function DisplayNotes(noteBookName) {
  notesEl.innerHTML = "";
  let noteBooks = await fetchDataFromLocalStorage();
  let [...noteBook] = noteBooks.filter((noteBook) => {
    return noteBook.name === noteBookName;
  });

  noteBook[0].notes.forEach((note) => {
    let noteListItem = `
    <li class="note" id="note">
              <h2 class="note-heading">${note.title}</h2>
              <p class="note-body">
               ${note.body}
              </p>
              <small class="updated-before" id="updated-before"
                >${note.updated_on}</small
              >
              <section class="update-buttons">
                <button class="edit" id="edit">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="delete" id="delete" onclick="handleDeleteNote('${note.title}')">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </section>
            </li>`;
    notesEl.innerHTML += noteListItem;
  });
}

function handleDeleteNote(noteTitle) {
  noteBookItems = document.querySelectorAll(".list-item");
  noteBookItems.forEach((noteBook) => {
    if (noteBook.classList.contains("active")) {
      let noteBookItem = noteBook;
      let noteBookName = noteBook.innerText;
      let noteBooks = fetchDataFromLocalStorage();
      let updatedNoteBooks = noteBooks.map((nBook) => {
        if (nBook.name === noteBookName) {
          let newNotes = nBook.notes.filter((note) => {
            return note.title !== noteTitle;
          });
          nBook.notes = newNotes;
        }
        return nBook;
      });
      localStorage.setItem("noteBooks", JSON.stringify(updatedNoteBooks));
      displayDataFromLocalStorage("NO", noteBookItem);
    }
  });
}

addNoteBookEl.addEventListener("click", function () {
  overlayEl.style.display = "block";
  newBookModal.style.display = "block";
  newBookNameEl.focus();
});

newBookSubmit.addEventListener("click", function () {
  let noteBookName = newBookNameEl.value;
  addNoteBook(noteBookName);
});

addNoteEl.addEventListener("click", function () {
  overlayEl.style.display = "block";
  newNoteModal.style.display = "block";
});

newBookCancel.addEventListener("click", function () {
  newBookModal.style.display = "none";
  overlayEl.style.display = "none";
});

newNoteCancel.addEventListener("click", function () {
  newNoteModal.style.display = "none";
  overlayEl.style.display = "none";
});

async function addNoteBook(noteBookName) {
  if (!noteBookName) return;
  let noteBooks = await fetchDataFromLocalStorage();
  let existing = noteBooks.filter((noteBook) => {
    noteBook.name === noteBookName;
  });
  if (existing.length === 0) {
    let noteBook = {
      id: noteBookName.split(" ")[0].toLowerCase(),
      name: noteBookName,
      notes: [],
    };

    let noteBooks = await fetchDataFromLocalStorage();
    noteBooks.push(noteBook);
    localStorage.setItem("noteBooks", JSON.stringify(noteBooks));
  }

  displayDataFromLocalStorage();
  newBookNameEl.value = "";
  newBookModal.style.display = "none";
  overlayEl.style.display = "none";
}

newNoteSubmit.addEventListener("click", function () {
  let noteTitle = noteTitleEl.innerText;
  let noteContent = noteContentEl.value;
  let note = {
    id: Math.floor(Math.random() * 300000000),
    title: noteTitle,
    body: noteContent,
    updated_on: new Date().toLocaleDateString(),
  };

  noteBookItems.forEach((noteBookItem) => {
    if (noteBookItem.classList.contains("active")) {
      let noteBookName = noteBookItem.innerText;
      let noteBooks = fetchDataFromLocalStorage();
      let updatedNotes = noteBooks.map((noteBook) => {
        if (noteBook.name === noteBookName) {
          noteBook.notes.push(note);
          return noteBook;
        } else {
          return noteBook;
        }
      });

      localStorage.setItem("noteBooks", JSON.stringify(updatedNotes));
      displayDataFromLocalStorage("NO", noteBookItem);
      noteTitleEl.innerText = "NOTE TITLE";
      noteContentEl.value = "";
      newNoteModal.style.display = "none";
      overlayEl.style.display = "none";
    }
  });
});
