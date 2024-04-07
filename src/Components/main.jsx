import React, { useState, useEffect } from 'react';
import FormattingContainer from './FormattingContainer';
function generateRandomId() {
    return Math.floor(Math.random() * 1000000).toString();
}
function Main(props) {
    const [animation, setAnimation] = useState('');
    const [title, setTitle] = useState(props.title);
    const [description, setDescription] = useState(props.description);
    const [showFormatting, setShowFormatting] = useState(false);
    const notes = props.notes;

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        updateNoteInArray();
    };

    const handleDescChange = (e) => {
        setDescription(e.target.value);
        updateNoteInArray();
    };

    const updateNoteInArray = () => {
        const updatedNotes = notes.map((note) => {
            if (note.id === props.noteId) {
                return {
                    ...note,
                    title: title,
                    description: description,
                };
            }
            return note;
        });
        props.setNotes(updatedNotes);
    };
    useEffect(() => {
        const handleKeyPress = (event) => {
            // Check if the user pressed Ctrl + S
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault(); // Prevent default browser save action

                // Call your function here
                
                updateNoteInArray();
                console.log("saved")
            }
        };

        // Add event listener for keydown event
        document.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener when component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []); // Empty dependency array ensures the effect runs only once on mount

    const checkForSelection = () => {
        const text = window.getSelection().toString();
        setShowFormatting(text.length > 0);
    };

    useEffect(() => {
        document.addEventListener('mouseup', checkForSelection);
        return () => {
            document.removeEventListener('mouseup', checkForSelection);
        };
    }, []);

    useEffect(() => {
        setAnimation("show");
        setTitle(props.title);
        setDescription(props.description);
    }, [props.noteId, props.title, props.description]);

    return (
        <>
            <div className={`container ${props.menu === "hidden" ? "active" : ""}`}>
                <div className="noteContainer">
                    <div className={`noteHeading  ${animation === " show" ? "show" : ''}`}>
                        <input type="text" className={`title ${animation === " show" ? "showinp" : ''}`} value={title} onChange={handleTitleChange} />
                    </div>
                    <div className="noteDesc">
                        <textarea type="text" className="noteDesc" value={description} onChange={handleDescChange} />
                    </div>
                </div>

            </div >
        </>
    );
}

export default Main;
