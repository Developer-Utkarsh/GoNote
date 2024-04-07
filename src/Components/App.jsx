import { useState, useEffect, useRef } from 'react';
import Sidebar from './sidebar';
import Main from './main';
import './App.css';
import welcomeSound from './sounds/welcome_sound.mp3';
import User from './user';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Import Clerk components if you're using them for authentication
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';

function App() {

  const [menu, setMenu] = useState("");
  const [toggler, setToggler] = useState("hidden");
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('Welcome Note');
  const [desc, setDesc] = useState('This is welcome note');
  const [noteId, setNoteId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showWelcomeText, setShowWelcomeText] = useState(false);

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
          playWelcomeSound()

        }, 0);
        setShowWelcomeText(false);
      }, 3500);
    };

    simulateLoading();// Adjust the delay time as needed
  }, []);
  const toggleMenu = () => {
    setMenu(menu === "" ? "hidden" : "");
    setToggler(toggler === "hidden" ? "" : "hidden");
  };
  const hamburgerRef = useRef(null);
  function generateRandomId() {
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 8; // Adjust the length as needed

    do {
      id = '';
      for (let i = 0; i < idLength; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    } while (notes.some(note => note.id === id));

    return id;
  }

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
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const savedNotes = localStorage.getItem('notes');
  if (!savedNotes) {
    localStorage.setItem('notes', JSON.stringify(notes));
    // 

  }
  useEffect(() => {

    const fetchNotesFromLocalStorage = () => {
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);


        // Set the first note as active if there are notes saved
        if (parsedNotes.length > 0) {
          const firstNote = parsedNotes[0];
          setTitle(firstNote.title);
          setDesc(firstNote.description);
          setNoteId(firstNote.id);

        } if (parsedNotes.length === 0) {
          // If there are no saved notes, create a default "Welcome Note"
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

        }
      }
    }

    fetchNotesFromLocalStorage();
  }, []);

  useEffect(() => {
    const saveNotesToLocalStorage = () => {
      localStorage.setItem('notes', JSON.stringify(notes));
    }

    saveNotesToLocalStorage();
  }, [notes]);

  // const updateNote = (noteId, updatedTitle, updatedDescription) => {
  //   const updatedNotes = notes.map((note) => {
  //     if (note.id === noteId) {
  //       return {
  //         ...note,
  //         title: updatedTitle,
  //         description: updatedDescription
  //       };
  //     }
  //     return note;
  //   });
  //   setNotes(updatedNotes);
  // };
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
                <p className="text">Loading GoNote</p>
              </div>
            ) : (
              <>
                <Sidebar menu={menu} setMenu={setMenu} notesArray={notes} setNotes={setNotes} setTitle={setTitle} setDesc={setDesc} setNoteId={setNoteId} toggleMenu={toggleMenu} noteId={noteId}
                  toggleSidebar={toggleSidebar} hamburgerRef={hamburgerRef} />
                <Main menu={menu} setMenu={setMenu} title={title} description={desc} noteId={noteId} setTitle={setTitle} setDesc={setDesc} setNotes={setNotes} notes={notes} showWelcomeText={showWelcomeText} loading={loading} />
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