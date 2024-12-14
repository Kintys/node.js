import express from 'express'
import usersTypesController from '../controllers/usersTypesController.mjs'

const router = express.Router()

router.get('/:id', usersTypesController.getById)
router.get('/', usersTypesController.getList)

router.post('/register/:id?', usersTypesController.register)

router.delete('/', usersTypesController.delete)

export default router
