import { Notes } from "../models/notes.model.js"

// Save a brand new note
export const createNote = async (req, res) => {
    try {
        const { text, style, color } = req.body;

        const newNote = new Notes({
            text,
            style,
            color
        });

        const savedNote = await newNote.save();
        return res.status(201).json(savedNote);
    } catch (error) {
        console.error('Failed to create note:', error);
        return res.status(400).json({
            message: 'Failed to create note',
            error: error.message
        });
    }
};

// for finding note i should use Notes.find()

