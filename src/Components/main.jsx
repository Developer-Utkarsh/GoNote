import React, { useState, useEffect, useCallback } from 'react';
import FormattingContainer from './FormattingContainer';
import ImageContainer from './ImgContainer';
import OpenedImage from './OpenedImage';
import Alert from './Alert'
function generateRandomId() {
    return Math.floor(Math.random() * 1000000).toString();
}

function Main(props) {
    const [openedImage, setOpenedImage] = useState(null);
    const [animation, setAnimation] = useState('');
    const [title, setTitle] = useState(props.title);
    const [description, setDescription] = useState(props.description);
    const [showFormatting, setShowFormatting] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [audio, setAudio] = useState(null);
    const [uploadedImages, setUploadedImages] = useState(props.imagesArray);
    const [autoSaveInterval, setAutoSaveInterval] = useState(null);
    const [isSaved, setIsSaved] = useState(true);
    const saveNote = useCallback(() => {
        const updatedNotes = props.notes.map((note) => {
            if (note.id === props.noteId) {
                return { ...note, title, description, images: uploadedImages };
            }
            return note;
        });
        props.setNotes(updatedNotes);
        setIsSaved(true);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }, [props.notes, props.noteId, title, description, uploadedImages]);
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                saveNote();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    const updateNoteInArray = useCallback(() => {
        const updatedNotes = props.notes.map((note) => {
            if (note.id === props.noteId) {
                return { ...note, title, description, images: uploadedImages };
            }
            return note;
        });
        props.setNotes(updatedNotes);
        setIsSaved(true);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }, [props.notes, props.noteId, title, description, uploadedImages]);

    const debouncedUpdateNoteInArray = useCallback(
        debounce(updateNoteInArray, 2000),
        [updateNoteInArray]
    );

    useEffect(() => {
        const interval = setInterval(() => {
            saveNote();
        }, 15000);

        setAutoSaveInterval(interval);

        return () => {
            clearInterval(interval);
        };
    }, [saveNote]);

    useEffect(() => {
        if (uploadedImages === undefined) {
            setUploadedImages([]);
        } else {
            setUploadedImages(uploadedImages);
        }
    }, [uploadedImages]);

    const handleImageUpload = (imageDataURL) => {
        setUploadedImages((prevImages) => [...prevImages, imageDataURL]);

        const updatedNote = {
            ...props.notes.find((note) => note.id === props.noteId),
            title,
            description,
            images: [...uploadedImages, imageDataURL],
        };

        const updatedNotes = props.notes.map((note) =>
            note.id === props.noteId ? updatedNote : note
        );

        debouncedUpdateNoteInArray();
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    const [showAlert, setShowAlert] = useState(false);

    const handleTitleChange = useCallback((e) => {
        const newTitle = e.target.value;
        if (newTitle.trim().length > 0) {
            // Check if the new title exceeds the limit
            if (newTitle.length > 20) {
                // Show custom alert
                setShowAlert(true);
            } else {
                setTitle(newTitle);
                setIsSaved(false);
                debouncedUpdateNoteInArray();
            }
        }
    }, [debouncedUpdateNoteInArray]);

    const handleCloseAlert = () => {
        setShowAlert(false);
        // Trim title to 18 characters
        setTitle(title.slice(0, 18));
        setIsSaved(false);
        debouncedUpdateNoteInArray();
    };

    const handleDescChange = useCallback((e) => {
        const newDescription = e.target.value;
        setDescription(newDescription);
        setIsSaved(false);
        debouncedUpdateNoteInArray();
    }, [debouncedUpdateNoteInArray]);




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
        setUploadedImages(props.imagesArray);
    }, [props.noteId, props.title, props.description, props.imagesArray]);

    const handleImageRemoval = (index) => {
        const updatedImages = [...uploadedImages];
        updatedImages.splice(index, 1);
        setUploadedImages(updatedImages);

        const updatedNote = {
            ...props.notes.find((note) => note.id === props.noteId),
            title,
            description,
            images: updatedImages,
        };

        const updatedNotes = props.notes.map((note) =>
            note.id === props.noteId ? updatedNote : note
        );

        props.setNotes(updatedNotes);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    const fetchImagesFromStorage = () => {
        const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        const noteWithImages = storedNotes.find((note) => note.id === props.noteId);

        if (noteWithImages && noteWithImages.images) {
            setUploadedImages(noteWithImages.images);
        } else {
            setUploadedImages([]);
        }
    };

    useEffect(() => {
        fetchImagesFromStorage();
    }, [props.noteId]);

    return (
        <>
            <div className={`container ${props.menu === 'hidden' ? 'active' : ''}`}>
                {showAlert && <Alert message="Title should not exceed 20 characters!" onClose={handleCloseAlert} />}
                <div className="noteContainer">
                    <div className="mainComponent">
                        <div
                            className={`noteHeading   ${props.loading === false &&
                                props.showWelcomeText === false &&
                                animation === 'show'
                                ? 'show'
                                : ''
                                }`}
                        >
                            <input
                                type="text"
                                className={`title  ${props.loading === false &&
                                    props.showWelcomeText === false &&
                                    animation === 'show'
                                    ? 'showinp'
                                    : ''
                                    }`}
                                value={title}
                                onChange={handleTitleChange}
                            />
                        </div>
                        <div className="saveIcon" onClick={saveNote}>
                            <i
                                className={`${isSaved ? 'fa fa-save' : 'fa fa-cloud-upload-alt'} ${isSaved ? 'saved' : 'unsaved'}`}
                            ></i>
                        </div>
                    </div>
                    <div className="noteDesc">
                        <ImageContainer
                            handleImageUpload={handleImageUpload}
                            uploadedImages={uploadedImages}
                            handleImageRemoval={handleImageRemoval}
                            setOpenedImage={setOpenedImage}
                        />
                        <textarea
                            type="text"
                            className="noteDesc"
                            value={description}
                            onChange={handleDescChange}
                        />
                    </div>
                </div>
            </div>
            {openedImage && <OpenedImage openedImage={openedImage} setOpenedImage={setOpenedImage} />}
        </>
    );
}
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