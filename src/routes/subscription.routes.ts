import {Router} from 'express'
import { createSubscription, readSubscription } from '../controllers/subscription.controller.js'

const router = Router()

router.post('/subscriptions' , createSubscription)
router.get('/subscriptions/:userId' , readSubscription)

export default router
