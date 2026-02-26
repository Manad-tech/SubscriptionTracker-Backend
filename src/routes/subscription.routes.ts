import {Router} from 'express'
import { createSubscription } from '../controllers/subscription.controller.js'

const router = Router()

router.post('/subscriptions' , createSubscription)

export default router
