import React, { useState, useEffect } from 'react';
import deleteSound from './sounds/delete.mp3';

function Note(props) {
    const [activeNote, setActiveNote] = useState('');
    const [description, setDescription] = useState(props.description);

    const handleActiveNote = () => {
        if (props.currentNoteId === props.noteId) {
            setActiveNote('active');
        } else {
            setActiveNote('');
        }
    };

    useEffect(() => {
        handleActiveNote();
    }, [props.noteId]);

    useEffect(() => {
        setDescription(truncateString(props.note.description)); // Update description when props change
    }, [props.note.description]);

    function truncateString(str) {
        // Split the string into an array of words
        const words = str.split(' ');

        // If the string has 3 or fewer words and is 15 characters or less, return the original string
        if (words.length <= 4 && str.length <= 20) {
            return str;
        }

        // If the string has more than 3 words or is longer than 15 characters, truncate it
        let truncatedString = words.slice(0, 4).join(' '); // Keep only the first 3 words

        // If the truncated string is longer than 15 characters, truncate it to 15 characters
        if (truncatedString.length > 20) {
            truncatedString = truncatedString.substring(0, 20) + '...';
        } else {
            // Otherwise, add an ellipsis to the end
            truncatedString += '...';
        }

        return truncatedString;
    }

    // Note.jsx
    const handleNoteClick = () => {
        props.onNoteClick(props.note.id, props.note.title, props.note.description, props.note.images, props.note.tag, props.note.theme);
    };

    const playDeleteSound = () => {
        const audio = new Audio(deleteSound);
        audio.volume = 0.5;
        audio.play();
    };

    const handleDeleteNote = (e) => {
        playDeleteSound();
        e.stopPropagation(); // Prevent the note click event from firing
        props.deleteNote(props.note.id);
    };
    const [tagSituation, setTagSituation] = useState(false)
    useEffect(() => {
        if (props.note.tag === "TAG") {
            setTagSituation(false)
        }
        setTagSituation(true)

    }, [tagSituation])

    return (
        <>
            <div className={`note ${activeNote === 'active' ? 'currentNote' : ''} ${props.note.theme ? props.note.theme + "note themeNote" : ''}`} onClick={handleNoteClick}>
                <div className={`note-items ${activeNote === 'active' ? 'activeNote' : ''}`}>
                    <div className="note-header">
                        <div className="titleContainer">
                            <p className="title">{props.note.title}</p>
                        </div>
                        <p className="desc">{description}</p>
                    </div>
                    <div className="note-footer">
                        {props.note.tag && props.note.tag !== "TAG" && <div className="noteTag">
                            <div className="tagNote">
                                <p>{props.note.tag}</p>
                            </div>

                        </div>}
                        <p className="time">{props.note.date}<span className="time"> -{props.note.time}</span></p>
                    </div>
                    <div className="deleteContainer" onClick={handleDeleteNote}>
                        <i className="fa-solid fa-trash"></i>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Note;
