const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB connection established successfully');
});

// Note schema
const noteSchema = new mongoose.Schema({
    title: String,
    description: String,
    images: [String],
    tag: String,
    theme: String,
    email: String,
    date: String,
    time: String,
    id: String,
});

const Note = mongoose.model('Note', noteSchema);

// Function to add or update a note
const addOrUpdateNote = async (note) => {
    try {
        // Check if a note with the given id and email exists
        const existingNote = await Note.findOne({ id: note.id, email: note.email });
        if (note.email) {
            if (existingNote) {
                // If note exists, update it with the new details
                existingNote.title = note.title;
                existingNote.description = note.description;
                existingNote.images = [];
                existingNote.tag = note.tag;
                existingNote.theme = note.theme;
                existingNote.date = note.date;
                existingNote.time = note.time;
                const updatedNote = await existingNote.save();
            } else {
                // If note does not exist, create a new one
                const newNote = await Note.create(note);
            }
        }
    } catch (error) {
        console.error('Error adding or updating note:', error);
    }
};

app.post('/api/notes/saveNote', async (req, res) => {
    const notesArray = req.body.notesToSave; // Assuming the notes array is sent in the request body as 'notesToSave'
    const email = req.body.email; // Assuming the email is sent in the request body as 'email'
    try {
        // Delete all existing notes for the provided email
        await Note.deleteMany({ email });

        // Save each note from the provided notes array
        for (const note of notesArray) {
            await addOrUpdateNote({ ...note, email });
        }

        res.status(200).send('Notes saved successfully');
    } catch (error) {
        console.error('Error saving notes:', error);
        res.status(500).send('Error saving notes');
    }
});
app.get('/api/notes/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const notes = await Note.find({ email });
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});