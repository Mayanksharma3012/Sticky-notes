import {Router} from 'express'

const router = Router()

import { createNote, findNote } from '../controllers/notes.controller.js'
router.post('/notes', createNote)

router.get('/notes', findNote)

export default router