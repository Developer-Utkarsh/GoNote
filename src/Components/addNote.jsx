// AddNote.jsx
import React, { useState } from 'react';
function AddNote(props) {
    function generateRandomId() {
        let id = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const idLength = 8; // Adjust the length as needed

        do {
            id = '';
            for (let i = 0; i < idLength; i++) {
                id += characters.charAt(Math.floor(Math.random() * characters.length));
            }
        } while (props.notes.some(note => note.id === id));

        return id;
    }
    const [noteTitle, setNoteTitle] = useState('New Note');
    const [noteDescription, setNoteDescription] = useState('New Note Description');

    const handleAddNote = () => {
        const currentDate = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = currentDate.toLocaleDateString('en-US', options);
        const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const newNote = {
            title: noteTitle,
            description: noteDescription,
            date: formattedDate,
            time: formattedTime,
            id: generateRandomId()
        };
        props.addNewNote(newNote);
        setNoteTitle('New Note');
        setNoteDescription('New Note Description');
    };

    return (
        <>
            <div className="btn-container">
                <button className="btn negative" onClick={handleAddNote}>
                    Add Note
                </button>
            </div>
        </>
    );
}

export default AddNote;