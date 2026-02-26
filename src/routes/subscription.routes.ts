import {Router} from 'express'
import { createSubscription, readSubscription, readAllSubscriptions } from '../controllers/subscription.controller.js'

const router = Router()

router.post('/subscriptions' , createSubscription)
router.get('/subscriptions/:id' , readSubscription)
router.get('/subscriptions' , readAllSubscriptions)

export default router
