import React, { useState, useEffect, useCallback } from 'react';
import FormattingContainer from './FormattingContainer';
import ImageContainer from './ImgContainer';
import OpenedImage from './OpenedImage';
import Alert from './Alert';

function generateRandomId() {
    return Math.floor(Math.random() * 1000000).toString();
}

function Main(props) {
    const { tag, setTag } = props
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
    const [tagCondition, setTagCondition] = useState("");

    useEffect(() => {
        if (props.tag) {

            const capital = props.tag.toUpperCase();
            props.setTag(capital);
            if (props.tag === "TAG") {
                setTagCondition('');
            } else {
                setTagCondition('tagActive');
            }
        }
        else {
            props.setTag("TAG")
        }
    }, [props.tag]);

    const saveNote = useCallback(() => {
        const updatedNotes = props.notes.map((note) => {
            if (note.id === props.noteId) {
                return { ...note, title, description, images: uploadedImages, tag };
            }
            return note;
        });
        props.setNotes(updatedNotes);
        setIsSaved(true);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }, [props.notes, props.noteId, title, description, uploadedImages, props.tag]);

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
    }, [saveNote]);
    const updateNoteInArray = useCallback(() => {
        const updatedNotes = props.notes.map((note) => {
            if (note.id === props.noteId) {
                return { ...note, title, description, images: uploadedImages, tag: props.tag }; // Include the tag value
            }
            return note;
        });
        props.setNotes(updatedNotes);
        setIsSaved(true);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }, [props.notes, props.noteId, title, description, uploadedImages, props.tag]);

    const debouncedUpdateNoteInArray = useCallback(
        debounce(updateNoteInArray, 1000),
        [updateNoteInArray]
    );

    useEffect(() => {
        const interval = setInterval(() => {
            saveNote();
        }, 5000);

        setAutoSaveInterval(interval);

        return () => {
            clearInterval(interval);
        };
    }, [saveNote]);

    useEffect(() => {
        if (uploadedImages === undefined) {
            setUploadedImages([]);
        }
    }, [uploadedImages]);

    const handleImageUpload = (imageDataURL) => {

        setUploadedImages((prevImages) => (prevImages ? [...prevImages, imageDataURL] : [imageDataURL]));

        const updatedNote = {
            ...props.notes.find((note) => note.id === props.noteId),
            title,
            description,
            images: [...(uploadedImages || []), imageDataURL],
            tag
        };

        const updatedNotes = props.notes.map((note) =>
            note.id === props.noteId ? updatedNote : note
        );

        saveNote();
        debouncedUpdateNoteInArray();
        setIsSaved(false);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));

    };

    const [showAlert, setShowAlert] = useState(false);

    const handleTitleChange = useCallback((e) => {
        const newTitle = e.target.value;
        if (newTitle.trim().length > 0) {
            if (newTitle.length > 20) {
                setShowAlert(true);
            } else {
                setTitle(newTitle);
                setIsSaved(false);
                debouncedUpdateNoteInArray();
            }
        }
    }, [debouncedUpdateNoteInArray]);

    const handleTag = useCallback((e) => {
        const newTag = e.target.value;
        if (newTag.length > 0) {
            if (newTag.length > 10) {
                setShowAlert(true);
            } else {
                props.setTag(newTag);
                setIsSaved(false);
                debouncedUpdateNoteInArray();
            }
        } else {
            // If the input is an empty string, set the tag to an empty string
            props.setTag("");
            setIsSaved(false);
            debouncedUpdateNoteInArray();
        }
    }, [debouncedUpdateNoteInArray, props.setTag]);

    const handleCloseAlert = () => {
        setShowAlert(false);
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
        props.setTag(props.tag); // Ensure tag is set from props
    }, [props.noteId, props.title, props.description, props.imagesArray, props.tag]);

    const handleImageRemoval = (index) => {
        const updatedImages = [...uploadedImages];
        updatedImages.splice(index, 1);
        setUploadedImages(updatedImages);

        const updatedNote = {
            ...props.notes.find((note) => note.id === props.noteId),
            title,
            description,
            images: updatedImages,
            tag
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
                        <div className="tagContainer">
                            <div className="tagBg">
                                <input type="text" className={`tag ${tagCondition}`} value={props.tag} onChange={handleTag} />
                            </div>
                        </div>
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
            func(...args);
        }, delay);
    };
}

export default Main;
