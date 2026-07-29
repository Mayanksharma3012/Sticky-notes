import mongoose from 'mongoose'

const notesSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true,
    },
    style: {
        type: String,
        enum:['lined','plain','graph','dotted','dark'],
        required: true
    },
    color: {
        type: String,
        enum:['Cream','Blush','Mist','Sage','Lilac','Wheat'],
        required: true
    },
    tilts:{
        type: String,
        enum:['tilt-left', 'tilt-right', 'tilt-normal'],
        required: true
    }
},{timestamps: true})

export const Notes = mongoose.model('Notes', notesSchema);