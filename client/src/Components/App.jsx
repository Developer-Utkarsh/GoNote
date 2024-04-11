import { useState, useEffect, useRef } from 'react';
import Sidebar from './sidebar';
import Main from './main';
import debounce from 'lodash.debounce';
import './App.css';
import welcomeSound from './sounds/welcome_sound.mp3';
import User from './user';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { saveNote } from '../api.jsx';
import { getNotes } from '../api';

function App() {
  const [menu, setMenu] = useState("");
  const [toggler, setToggler] = useState("hidden");
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('Welcome Note');
  const [desc, setDesc] = useState('This is welcome note');
  const [noteId, setNoteId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();
  const [firstname, setFirstname] = useState();
  const [email, setEmail] = useState();
  const [imagesArray, setImagesArray] = useState();
  const [tag, setTag] = useState();
  const [theme, setTheme] = useState('');
  const [emailUpdated, setEmailUpdated] = useState(false);
  const [autoSaveInterval, setAutoSaveInterval] = useState(null);
  const [notesFetchedFromServer, setNotesFetchedFromServer] = useState(false);

  // Update notes with user's email if not already updated
  const updateEmailInNotes = () => {
    if (!emailUpdated) {
      const updatedNotes = notes.map((note) => {
        return { ...note, email: user.emailAddresses[0].emailAddress };
      });
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      setEmailUpdated(true);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      setEmail(user.emailAddresses[0].emailAddress);
      setFirstname(user.firstName);
      updateEmailInNotes();
    } else {
      setEmailUpdated(false);
    }
  }, [user, isSignedIn]);

  // Function to generate a random ID
  function generateRandomId() {
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 8;

    do {
      id = '';
      for (let i = 0; i < idLength; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    } while (notes.some(note => note.id === id));

    return id;
  }

  useEffect(() => {
    // Simulating loading delay with setTimeout
    const simulateLoading = () => {
      setTimeout(() => {
        setLoading(false);
        setShowWelcomeText(true);
      }, 500);
      const playWelcomeSound = () => {
        const audio = new Audio(welcomeSound);
        audio.volume = 0.5;
        audio.play();
      };
      setTimeout(() => {
        setTimeout(() => {
          playWelcomeSound();
        }, 0);
        setShowWelcomeText(false);
      }, 3500);
    };

    simulateLoading();
  }, []);

  const toggleMenu = () => {
    setMenu(menu === "" ? "hidden" : "");
    setToggler(toggler === "hidden" ? "" : "hidden");
  };

  const hamburgerRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 792) {
        toggleMenu();
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const savedNotes = localStorage.getItem('notes');
  if (!savedNotes) {
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  useEffect(() => {
    const fetchNotesFromLocalStorage = () => {
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);

        if (parsedNotes.length > 0) {
          const firstNote = parsedNotes[0];
          setTitle(firstNote.title);
          setDesc(firstNote.description);
          setNoteId(firstNote.id);
          setTag(firstNote.tag || "TAG");
          setImagesArray(firstNote.images || []);
          setTheme(firstNote.theme || '');
        } else {
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
          setNotes([welcomeNote]);
          setTitle(welcomeNote.title);
          setDesc(welcomeNote.description);
          setNoteId(welcomeNote.id);
          setTag("TAG");
          setImagesArray([]);
          setTheme('');
        }
      }
    };
    fetchNotesFromLocalStorage();
  }, []);

  useEffect(() => {
    const saveNotesToLocalStorage = () => {
      localStorage.setItem('notes', JSON.stringify(notes));
    }

    saveNotesToLocalStorage();
  }, [notes]);

  const toggleSidebar = () => {
    setMenu(menu === "" ? "hidden" : "");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const hamburgerIcon = hamburgerRef.current;

      if (
        hamburgerIcon &&
        !hamburgerIcon.contains(event.target) &&
        window.innerWidth < 792 &&
        menu === ''
      ) {
        setMenu("hidden");
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [menu]);

  useEffect(() => {
    if (isSignedIn) {
      setEmail(user.emailAddresses[0].emailAddress)
      setFirstname(user.firstName)
    }
  }, [user]);

  useEffect(() => {
    if (tag) {
      setTag(tag.toUpperCase())
    }
  });

  const [pendingNotesUpdate, setPendingNotesUpdate] = useState([]);
  const debouncedSaveNotesToServer = useRef(
    debounce((notesToSave, email) => saveNotesToServer(notesToSave, email), 5000)
  ).current;

  useEffect(() => {
    if (email && notes.length > 0) {
      debouncedSaveNotesToServer(notes, email);
    }
  }, [email, notes, debouncedSaveNotesToServer]);

  const saveNotesToServer = async (notesToSave, email) => {
    try {
      const notesWithoutImages = notesToSave.map(note => {
        const { images, ...rest } = note;
        return rest;
      });

      const updatedNotes = await saveNote(notesWithoutImages, email);
      setPendingNotesUpdate([]);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const [isAppClosing, setIsAppClosing] = useState(false);
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsAppClosing(true);
      saveNotesToServer(notes, email);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [notes]);

  useEffect(() => {
    const isNotesFetchedFromServerString = localStorage.getItem('isNotesFetchedFromServer');
    const isNotesFetchedFromServer = isNotesFetchedFromServerString === null ? false : JSON.parse(isNotesFetchedFromServerString);
    setNotesFetchedFromServer(isNotesFetchedFromServer);
  }, []);

  const fetchAndMergeMergedNotes = async () => {
    if (!email) {
      // If there is no email available, set the `notesFetchedFromServer` to true
      // to prevent further attempts to fetch notes from the server
      setNotesFetchedFromServer(true);
      localStorage.setItem('isNotesFetchedFromServer', JSON.stringify(true));
      return notes;
    }

    try {
      const { data: databaseNotes } = await getNotes(email);

      const filteredDatabaseNotes = databaseNotes.filter(note => note.title !== "Welcome Note");

      const mergedNotes = [...notes, ...filteredDatabaseNotes];

      const uniqueMergedNotes = Array.from(new Set(mergedNotes.map(JSON.stringify))).map(JSON.parse);

      const updatedMergedNotes = uniqueMergedNotes.map(note => {
        const localNote = notes.find(n => n.id === note.id);
        if (localNote) {
          return { ...localNote };
        } else {
          return note;
        }
      });

      await saveNotesToServer(updatedMergedNotes, email);
      console.log(updatedMergedNotes);
      return updatedMergedNotes;
    } catch (error) {
      console.error('Error fetching notes:', error);
      return notes;
    }
  };

  useEffect(() => {
    const fetchNotesFromLocalStorageAndMerge = async () => {
      let mergedNotes = [];

      if (!notesFetchedFromServer && email) {
        mergedNotes = await fetchAndMergeMergedNotes();
        setNotes(mergedNotes);
        setNotesFetchedFromServer(true);
        localStorage.setItem('isNotesFetchedFromServer', JSON.stringify(true));
      } else {
        const parsedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        setNotes(parsedNotes);
        mergedNotes = parsedNotes;
      }

      if (mergedNotes.length > 0) {
        const firstNote = mergedNotes[0];
        setTitle(firstNote.title);
        setDesc(firstNote.description);
        setNoteId(firstNote.id);
        setTag(firstNote.tag || 'TAG');
        setImagesArray(firstNote.images || []);
        setTheme(firstNote.theme || '');
      } else {
        const currentDate = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = currentDate.toLocaleDateString('en-US', options);
        const formattedTime = currentDate.toLocaleTimeString('en -US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const welcomeNote = {
          title: 'Welcome Note',
          description: 'This is a welcome note.',
          date: formattedDate,
          time: formattedTime,
          id: generateRandomId(),
        };
        setNotes([welcomeNote]);
        setTitle(welcomeNote.title);
        setDesc(welcomeNote.description);
        setNoteId(welcomeNote.id);
        setTag('TAG');
        setImagesArray([]);
        setTheme('');
      }

      localStorage.setItem('notes', JSON.stringify(mergedNotes));
    };

    if (isSignedIn && email) {
      fetchNotesFromLocalStorageAndMerge();
    }
  }, [isSignedIn, email, notesFetchedFromServer]);

  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<div className="auth-container "><SignIn path='login' afterSignInUrl="" redirect_url="" signUpUrl="register " afterSignUpUrl="" /></div>} />
        <Route exact path="/register" element={<div className="auth-container register">    <SignUp path='register' afterSignUpUrl="" redirect_url="" afterSignInUrl="" signInUrl="login" /></div>} />
        <Route exact path="/" element={
          <>
            {loading ? (
              <div className="loaderContainer">
                <div className="loader"></div>
                <p className="text">Launching GoNote</p>
              </div>
            ) : (
              <>
                <Sidebar menu={menu} setMenu={setMenu} notesArray={notes} setNotes={setNotes} setTitle={setTitle} setDesc={setDesc} setNoteId={setNoteId} toggleMenu={toggleMenu} noteId={noteId}
                  toggleSidebar={toggleSidebar} hamburgerRef={hamburgerRef} setImagesArray={setImagesArray} imagesArray={imagesArray} tag={tag} setTag={setTag} theme={theme} setTheme={setTheme} />
                <Main
                  menu={menu}
                  setMenu={setMenu}
                  title={title}
                  description={desc}
                  noteId={noteId}
                  setTitle={setTitle}
                  setDesc={setDesc}
                  setNotes={setNotes}
                  notes={notes}
                  showWelcomeText={showWelcomeText}
                  loading={loading}
                  imagesArray={imagesArray}
                  setImagesArray={setImagesArray}
                  tag={tag}
                  setTag={setTag}
                  theme={theme}
                  setTheme={setTheme}
                  user={user}
                />
                <div className={`mainToggler ${menu === "hidden" ? "active" : ""}`} onClick={() => setMenu(menu === "" ? "hidden" : "")} ref={hamburgerRef}>
                  <i className="fa-solid fa-bars"></i>
                </div>
                <div className="user-continer">
                  <User />
                </div>
                {showWelcomeText && (
                  <div className="welcomeTextContainer">
                    <p className="typewriter">Welcome to GoNote</p>
                  </div>
                )}
              </>
            )}
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;