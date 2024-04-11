import React, { useState, useEffect, useRef } from 'react';
import AddNote from './addNote';
import Note from './note';
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, UserButton, useUser } from '@clerk/clerk-react'; // Importing useUser hook

function Sidebar(props) {
    const [notesArray, setNotesArray] = useState(props.notesArray);
    const { user } = useUser();
    const sidebarRef = useRef(null);
    function generateRandomId() {
        let id = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const idLength = 8; // Adjust the length as needed

        do {
            id = '';
            for (let i = 0; i < idLength; i++) {
                id += characters.charAt(Math.floor(Math.random() * characters.length));
            }
        } while (notesArray.some(note => note.id === id));

        return id;
    }

    useEffect(() => {
        setNotesArray(props.notesArray);
    }, [props.notesArray]);

    const addNote = (newNote) => {
        const updatedNotesArray = [newNote, ...notesArray];
        setNotesArray(updatedNotesArray);
        props.setNotes(updatedNotesArray);
    };

    function handleResize() {
        if (window.innerWidth < 792) {
            props.toggleMenu();
        }
    }
    // Sidebar.jsx
    const handleNoteClick = (noteId, noteTitle, noteDesc, imagesArray, noteTag, noteTheme) => {
        props.setTitle(noteTitle);
        props.setDesc(noteDesc);
        props.setNoteId(noteId);
        props.setImagesArray(imagesArray);
        props.setTag(noteTag);
        props.setTheme(noteTheme); // Pass the theme to the Main component
    };

    const onNoteClick = (noteId) => {
        const note = notesArray.find((obj) => obj.id === noteId);
        handleResize();
        if (note) {
            if (!note.images) {
                handleNoteClick(note.id, note.title, note.description, null, note.tag, note.theme);
            } else {
                handleNoteClick(note.id, note.title, note.description, note.images, note.tag, note.theme);
            }
        }
    };
    const toggleSidebar = () => {
        props.toggleMenu()
    }
    const deleteNote = (noteId) => {
        const updatedNotesArray = notesArray.filter((note) => note.id !== noteId);
        setNotesArray(updatedNotesArray);
        props.setNotes(updatedNotesArray);

        // Set the recent note as active
        if (updatedNotesArray.length > 0) {
            const recentNote = updatedNotesArray[0];
            handleNoteClick(recentNote.id, recentNote.title, recentNote.description);
        } else {
            // If there are no more notes, set a default note
            const currentDate = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = currentDate.toLocaleDateString('en-US', options);
            const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            const welcomeNote = {
                title: "Welcome Note",
                description: "This is a welcome note.",
                date: formattedDate,
                time: formattedTime,
                id: generateRandomId()
            };
            setNotesArray([welcomeNote]);
            props.setNotes([welcomeNote]);
            handleNoteClick(welcomeNote.id, welcomeNote.title, welcomeNote.description);
        }
    };
    const addNewNote = (newNote) => {
        const updatedNotesArray = [newNote, ...notesArray];
        setNotesArray(updatedNotesArray);
        props.setNotes(updatedNotesArray);
        handleNoteClick(newNote.id, newNote.title, newNote.description, newNote.tag);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            const sidebarContainer = sidebarRef.current;
            const hamburgerIcon = props.hamburgerRef.current;

            if (
                sidebarContainer &&
                !sidebarContainer.contains(event.target) &&
                hamburgerIcon &&
                !hamburgerIcon.contains(event.target) &&
                window.innerWidth < 792 &&
                props.menu === ''
            ) {
                props.toggleMenu();
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [props.menu, props.toggleMenu, props.hamburgerRef]);
    return (
        <>

            <div className={`sidebarContainer ${props.menu}`} ref={sidebarRef}>
                <div className='sidebar'>
                    <div className="brand">
                        <div className="brandDetails">
                            <img src="logo.png" alt="logo" />
                            <h2>GoNote</h2>
                        </div>
                        <div className="toggler" onClick={props.toggleMenu}>
                            <i className="fa-solid fa-bars"></i>
                        </div>
                    </div>
                    <div className="sidebarTop">
                        <div className="addNoteContainer">
                            <AddNote addNewNote={addNewNote} notes={notesArray} />
                        </div>
                    </div>
                    <div className="sidebar-notes">
                        <div className="notesContainer">
                            {notesArray.map((note) => (
                                <Note
                                    key={note.id}
                                    note={note}
                                    onNoteClick={() => onNoteClick(note.id)}
                                    updateNote={props.updateNote}
                                    onClick={toggleSidebar}
                                    notes={notesArray}
                                    noteId={props.noteId}
                                    currentNoteId={note.id}
                                    deleteNote={deleteNote}
                                    tag={props.tag}
                                    theme={props.theme}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="userSection">
                        {/* Conditionally rendering UserButton */}
                        {/* If user is logged in, show UserButton, else show SignIn button */}
                        <div className="copyright">By Utkarsh Tiwari</div>
                        <div className="socialMedia">
                            <a href="https://www.instagram.com/iam_utkarshtiwari/" target='_blank'><i className="fa-brands fa-instagram"></i></a>
                            <a href="https://github.com/Utkarsh-Web-2023" target='_blank'><i className="fa-brands fa-github"></i></a>


                        </div>
                    </div>
                </div>
            </div >

        </>
    );
}

export default Sidebar;