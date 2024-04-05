import { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Main from './main';
import './App.css';

function App() {

  const [menu, setMenu] = useState("");
  const [toggler, setToggler] = useState("hidden");
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('Welcome Note');
  const [desc, setDesc] = useState('This is welcome note');
  const [noteId, setNoteId] = useState('');

  const toggleMenu = () => {
    setMenu(menu === "" ? "hidden" : "");
    setToggler(toggler === "hidden" ? "" : "hidden");
  };

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

  return (
    <>
      <Sidebar
        menu={menu}
        notesArray={notes}
        setNotes={setNotes}
        setTitle={setTitle}
        setDesc={setDesc}
        setNoteId={setNoteId}
        toggleMenu={toggleMenu}
        noteId={noteId}
      />
      <Main
        menu={menu}
        title={title}
        description={desc}
        noteId={noteId}
        setTitle={setTitle}
        setDesc={setDesc}
        setNotes={setNotes}
        notes={notes}
      />
      <div className={`mainToggler ${menu === "hidden" ? "active" : ""}`} onClick={() => setMenu(menu === "" ? "hidden" : "")}>
        <i className="fa-solid fa-bars"></i>
      </div>
    </>
  );
}

export default App;