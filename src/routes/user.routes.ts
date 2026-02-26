import {Router} from 'express'
import { createUser, deleteUser, readAllUsers, readUser, updateUser } from '../controllers/user.controller.js'

const router = Router();

router.post('/users', createUser);
router.get('/users', readAllUsers);
router.get('/users/:id', readUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser)

export default router