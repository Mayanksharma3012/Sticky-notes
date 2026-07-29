import { Notes } from "../models/notes.model.js"

// Save a brand new note
export const createNote = async (req, res) => {
    try {
        const { text, style, color, tilts } = req.body;

        const newNote = new Notes({
            text,
            style,
            color,
            tilts
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


// find notes
// for finding note i should use Notes.find()

export const findNote = async (req, res) => {
    try {
        const notes = await Notes.find();
        return res.status(200).json(notes);
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to create note',
            error: error.message
        });
        
    }
}
