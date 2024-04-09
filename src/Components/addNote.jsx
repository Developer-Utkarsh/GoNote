import React, { useState } from 'react';
import successSound from './sounds/success.mp3';

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
    const playsuccessSound = () => {
        const audio = new Audio(successSound);
        audio.volume = 0.5;
        audio.play();
    };
    const handleAddNote = () => {
        playsuccessSound()

        const currentDate = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = currentDate.toLocaleDateString('en-US', options);
        const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const newNote = {
            title: noteTitle,
            description: noteDescription,
            date: formattedDate,
            time: formattedTime,
            tag: "TAG",
            images: [],
            id: generateRandomId()
        };
        props.addNewNote(newNote);
        setNoteTitle('New Note');
        setNoteDescription('New Note Description');
        // Trigger celebration effect
        // Remove the class after 3 seconds
    };

    return (
        <>
            <div className="btn-container">
                <button className="btn negative" onClick={handleAddNote}>
                    Add Note
                </button>
            </div>
            {/* Confetti effect container */}

        </>
    );
}

export default AddNote;
