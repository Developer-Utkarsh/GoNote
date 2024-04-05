import React, { useState, useEffect } from 'react';

function Note(props) {
    const [activeNote, setActiveNote] = useState('')
    const notes = props.notes;
    const handleActiveNote = () => {


        if (props.currentNoteId === props.noteId) {
            setActiveNote('active')
        } else {
            setActiveNote('')
        }

    }
    useEffect(() => {
        handleActiveNote()
    }, [props.noteId])
    function truncateString(str) {
        // Split the string into an array of words
        const words = str.split(' ');

        // If the string has 3 or fewer words, return the original string
        if (words.length <= 5) {
            return str;
        }

        // Create a new string with the first 3 words
        let truncatedString = words.slice(0, 5).join(' ');

        // If the truncated string is longer than 20 characters, truncate it to 20 characters
        if (truncatedString.length > 20) {
            truncatedString = truncatedString.substring(0, 20) + '...';
        } else {
            // Otherwise, add an ellipsis to the end
            truncatedString += '...';
        }

        return truncatedString;
    }
    let description = truncateString(props.note.description);
    const handleNoteClick = () => {
        props.onNoteClick(props.note.id, props.note.title, description);
    };
    const handleDeleteNote = (e) => {
        e.stopPropagation(); // Prevent the note click event from firing
        props.deleteNote(props.note.id);
    };

    return (
        <>
            <div className={`note ${activeNote === "active" ? "currentNote" : ""}`} onClick={handleNoteClick} >
                <div className={`note-items  ${activeNote === "active" ? "activeNote" : ""} `}>
                    <div className="note-header">
                        <div className="titleContainer">
                            <p className="title">{props.note.title}</p>
                        </div>
                        <p className="desc">{description}</p>
                    </div>
                    <div className="note-footer">
                        <p className="time">{props.note.date}<span className="time"> -{props.note.time}</span></p>
                    </div>
                    <div className="deleteContainer" onClick={handleDeleteNote}>
                        <i className="fa-solid fa-trash"></i>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Note;
