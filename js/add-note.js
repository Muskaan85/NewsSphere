document.querySelector('.btn_add').addEventListener('click', function() {
    addNote();
});

function addNote(text = "") {
    const note = document.createElement('div');
    note.classList.add('note-wrapper');
    note.draggable = true; 
    note.innerHTML = `
        <div class="operations">
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
        </div>
        <div class="main hidden"></div>
        <textarea></textarea>
    `;
            
    document.querySelector('.notecont').appendChild(note);
            
    const editBtn = note.querySelector('.edit');
    const deleteBtn = note.querySelector('.delete');
    const mainDiv = note.querySelector('.main');
    const textArea = note.querySelector('textarea');
    
    textArea.value = text;
    mainDiv.innerHTML = text;

    editBtn.addEventListener('click', function() {
        if (textArea.classList.contains('hidden')) {
            textArea.classList.remove('hidden');
            mainDiv.classList.add('hidden');
            textArea.value = mainDiv.innerText;
        } else {
            textArea.classList.add('hidden');
            mainDiv.classList.remove('hidden');
            mainDiv.innerText = textArea.value;
            updates();
        }
     });
    
    deleteBtn.addEventListener('click', function() {
        note.remove();
        updates();
    });

    textArea.addEventListener("input", updates);
    
    // Drag & Drop events
    note.addEventListener('dragstart', () => {
        note.classList.add('dragging');
    });

    note.addEventListener('dragend', () => {
        note.classList.remove('dragging');
        updates(); 
    });
    
    const notesContainer = document.querySelector('.notecont');
    notesContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingNote = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(notesContainer, e.clientY);
        if (afterElement == null) {
            notesContainer.appendChild(draggingNote);
        } else {
            notesContainer.insertBefore(draggingNote, afterElement);
        }
    });



    updates();
}

function updates() {
    const noteText = document.querySelectorAll("textarea");
    const notes = [];
    
    noteText.forEach((note) => notes.push(note.value));
    localStorage.setItem("notes", JSON.stringify(notes));
}
    
const savedNotes = JSON.parse(localStorage.getItem("notes"));
if (savedNotes) {
    savedNotes.forEach((noteTxt) => addNote(noteTxt));
}



function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.note-wrapper:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}