import React, { useState, useEffect, useCallback } from 'react';
import FormattingContainer from './FormattingContainer';
import editSound from './sounds/typing.mp3';

function generateRandomId() {
    return Math.floor(Math.random() * 1000000).toString();
}

function Main(props) {
    const [animation, setAnimation] = useState('');
    const [title, setTitle] = useState(props.title);
    const [description, setDescription] = useState(props.description);
    const [showFormatting, setShowFormatting] = useState(false);
    const [isTyping, setIsTyping] = useState(false); // Track typing status
    const [audio, setAudio] = useState(null); // Track audio element

    useEffect(() => {
        // Create audio element
        const newAudio = new Audio(editSound);
        newAudio.volume = 0.75;
        newAudio.loop = true; // Set the audio to loop continuously
        setAudio(newAudio);

        // Cleanup function to remove audio element
        return () => {
            if (audio) {
                audio.pause();
                setAudio(null);
            }
        };
    }, []);

    const playEditSound = () => {
        if (audio) {
            audio.currentTime = 0; // Reset the audio to start from the beginning
            audio.play();
        }
    };

    const stopEditSound = () => {
        if (audio) {
            audio.pause();
        }
    };

    const handleTitleChange = (e) => {
        if (!isTyping) {
            setIsTyping(true); // Set typing status to true when user starts typing
            playEditSound(); // Play edit sound when user starts typing
        }
        const newTitle = e.target.value;
        if (newTitle.split(' ').length > 5 || newTitle.length > 15) {
            const shortenedTitle = newTitle.substring(0, 15);
            alert(`Title is too long! It will be shortened to: ${shortenedTitle}`);
            setTitle(shortenedTitle);
        } else {
            setTitle(newTitle);
        }
        debouncedUpdateNoteInArray();
    };

    const handleDescChange = (e) => {
        if (!isTyping) {
            setIsTyping(true); // Set typing status to true when user starts typing
            playEditSound(); // Play edit sound when user starts typing
        }
        setDescription(e.target.value);
        debouncedUpdateNoteInArray();
    };

    const updateNoteInArray = useCallback(() => {
        const updatedNotes = props.notes.map((note) => {
            if (note.id === props.noteId) {
                return { ...note, title, description };
            }
            return note;
        });
        props.setNotes(updatedNotes);
    }, [props.notes, props.noteId, title, description]);

    // Debouncing function
    const debouncedUpdateNoteInArray = useCallback(
        debounce(updateNoteInArray, 750),
        [updateNoteInArray]
    );

    useEffect(() => {
        // Function to handle keydown events
        const handleKeyDown = (event) => {
            // Check if any key is pressed
            if (!isTyping) {
                setIsTyping(true); // Set typing status to true when user starts typing
                playEditSound(); // Play edit sound when user starts typing
            }
        };

        // Function to handle keyup events
        const handleKeyUp = () => {
            setIsTyping(false); // Set typing status to false when user stops typing
            stopEditSound(); // Stop edit sound when user stops typing
        };

        // Add event listeners for keydown and keyup
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // Cleanup function to remove event listeners
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [isTyping]);

    useEffect(() => {
        const checkForSelection = () => {
            const text = window.getSelection().toString();
            setShowFormatting(text.length > 0);
        };

        document.addEventListener('mouseup', checkForSelection);

        return () => {
            document.removeEventListener('mouseup', checkForSelection);
        };
    }, []);

    useEffect(() => {
        setAnimation('show');
        setTitle(props.title);
        setDescription(props.description);
    }, [props.noteId, props.title, props.description]);

    return (
        <>
            <div className={`container ${props.menu === 'hidden' ? 'active' : ''}`}>
                <div className="noteContainer">
                    <div className={`noteHeading   ${props.loading === false && props.showWelcomeText === false && animation === 'show' ? 'show' : ''}`}>
                        <input
                            type="text"
                            className={`title  ${props.loading === false && props.showWelcomeText === false && animation === 'show' ? 'showinp' : ''}`}
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </div>
                    <div className="noteDesc">
                        <textarea
                            type="text"
                            className="noteDesc"
                            value={description}
                            onChange={handleDescChange}
                        />
                    </div>
                </div>
            </div >
        </>
    );
}

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args); // Using functional form of setState to access latest state values
        }, delay);
    };
}

export default Main;