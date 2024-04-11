import React, { useState, useEffect, useCallback } from 'react';
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
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [transcriptTimeout, setTranscriptTimeout] = useState(null);

    const handleSpeechRecognition = () => {
        if ('webkitSpeechRecognition' in window) {
            const newRecognition = new window.webkitSpeechRecognition();
            newRecognition.continuous = true;
            newRecognition.interimResults = false;

            newRecognition.onstart = () => {
                setIsListening(true);
                const synth = window.speechSynthesis;
                const utterance = new SpeechSynthesisUtterance("Listening to your speech, boss");
                synth.speak(utterance);
            };

            newRecognition.onresult = (event) => {
                const finalTranscript = event.results[event.results.length - 1][0].transcript;
                setTranscript((prevTranscript) => prevTranscript + ' ' + finalTranscript);

                // Clear previous timeout, if any
                clearTimeout(transcriptTimeout);
                saveNote()

                // Set a new timeout to reset the transcript after a short delay
                const timeout = setTimeout(() => {
                    setTranscript('');
                }, 500);
                setTranscriptTimeout(timeout);
            };

            newRecognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };

            newRecognition.onend = () => {
                setIsListening(false);
                const synth = window.speechSynthesis;
                const utterance = new SpeechSynthesisUtterance("Thank you, boss");
                synth.speak(utterance);
                setTranscript('');
                saveNote()
            };

            if (isListening) {
                recognition.stop();
            } else {
                newRecognition.start();
                setRecognition(newRecognition);
            }
        } else {
            alert('Speech recognition is not supported in this browser.');
        }
    };



    useEffect(() => {
        return () => {
            clearTimeout(transcriptTimeout);
        };
    }, [transcriptTimeout]);


    // Main.jsx
    useEffect(() => {
        if (uploadedImages === undefined) {
            setUploadedImages([]);
        }
    }, [uploadedImages]);
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
        props.setTag("TAG")


    }, [props.tag]);

    // Main.jsx
    const saveNote = useCallback(() => {
        const updatedNotes = props.notes.map((note) => {
            if (note.id === props.noteId) {
                return {
                    ...note,
                    title: title,
                    description: description,
                    images: uploadedImages,
                    tag: props.tag,
                    theme: props.theme,
                    email: props.user ? props.user.emailAddresses[0].emailAddress : '', // Use props.user instead of user
                };
            }
            return note;
        });
        props.setNotes(updatedNotes);
        setIsSaved(true);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }, [props.notes, props.noteId, title, description, uploadedImages, props.tag, props.theme, props.user]);

    const updateNoteInArray = useCallback(() => {
        const updatedNotes = props.notes.map((note) => {
            if (note.id === props.noteId) {
                return {
                    ...note,
                    title: title,
                    description: description,
                    images: uploadedImages,
                    tag: props.tag,
                    theme: props.theme,
                    email: props.user ? props.user.emailAddresses[0].emailAddress : '', // Use props.user instead of user
                };
            }
            return note;
        });
        props.setNotes(updatedNotes);
        setIsSaved(true);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }, [props.notes, props.noteId, title, description, uploadedImages, props.tag, props.theme, props.user]);

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
        setTitle(newTitle);
        props.setTitle(newTitle)
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
        props.setDesc(newDescription);
        setIsSaved(false);
        debouncedUpdateNoteInArray();
        saveNote()
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
    // Main.jsx
    useEffect(() => {
        setAnimation('show');
        setTitle(props.title);
        setDescription(props.description);
        setUploadedImages(props.imagesArray);
        props.setTag(props.tag);
        props.setTheme(props.theme); // Set the theme from props
    }, [props.noteId, props.title, props.description, props.imagesArray, props.tag, props.theme]);

    const handleImageRemoval = (index) => {
        const updatedImages = [...(uploadedImages || [])];
        updatedImages.splice(index, 1);
        setUploadedImages(updatedImages);

        const updatedNote = {
            ...props.notes.find((note) => note.id === props.noteId),
            title,
            description,
            images: updatedImages,
            tag: props.tag || 'TAG' // Set default tag to 'TAG' if props.tag is undefined
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


    const handleBlue = () => {
        if (props.theme === 'blue') {
            props.setTheme('');
        } else {
            props.setTheme('blue');
        }
    };

    const handleGreen = () => {
        if (props.theme === 'green') {
            props.setTheme('');
        } else {
            props.setTheme('green');
        }
    };

    const handleRed = () => {
        if (props.theme === 'red') {
            props.setTheme('');
        } else {
            props.setTheme('red');
        }
    };

    const handleYellow = () => {
        if (props.theme === 'yellow') {
            props.setTheme('');
        } else {
            props.setTheme('yellow');
        }
    };

    const handlePurple = () => {
        if (props.theme === 'purple') {
            props.setTheme('');
        } else {
            props.setTheme('purple');
        }
    };
    useEffect(() => {
        setDescription((prevDescription) => prevDescription + transcript);
        setTranscript('');
    }, [transcript]);
    return (
        <>
            <div className={`container ${props.menu === 'hidden' ? 'active' : ''} ${props.theme ? "theme" + props.theme : ''}`}>
                {showAlert && <Alert message="Title and Tag should not exceed 20 characters!" onClose={handleCloseAlert} />}
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
                        <div className="features">



                            <div className="themeContainer">
                                <div className="themes">
                                    <div className={`theme blue ${props.theme === 'blue' ? 'themeActive' : ''}`} onClick={handleBlue}></div>
                                    <div className={`theme green ${props.theme === 'green' ? 'themeActive' : ''}`} onClick={handleGreen}></div>
                                    <div className={`theme yellow ${props.theme === 'yellow' ? 'themeActive' : ''}`} onClick={handleYellow}></div>
                                    <div className={`theme purple ${props.theme === 'purple' ? 'themeActive' : ''}`} onClick={handlePurple}></div>
                                    <div className={`theme red ${props.theme === 'red' ? 'themeActive' : ''}`} onClick={handleRed}></div>
                                </div>
                            </div>
                            <div className="tagContainer">
                                <div className="tagBg">
                                    <input type="text" className={`tag ${tagCondition}`} value={props.tag} onChange={handleTag} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="assistantContainer" onClick={handleSpeechRecognition}>
                        <div className="assistant">
                            <i className="fas fa-microphone"></i>
                            {isListening && (
                                <div className="micStatus">
                                    <span className="micIcon">🎙️</span>
                                </div>
                            )}
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
