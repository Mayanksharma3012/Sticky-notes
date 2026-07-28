import {Router} from 'express'

const router = Router()

import { createNote } from '../controllers/notes.controller.js'
router.post('/notes', createNote)

export default router