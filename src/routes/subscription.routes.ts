import {Router} from 'express'
import { createSubscription, readSubscription, readAllSubscriptions, updateSubscription, deleteSubscription, readUsersSubscription } from '../controllers/subscription.controller.js'

const router = Router()

router.post('/subscriptions' , createSubscription)
router.get('/subscriptions/:id' , readSubscription)
router.get('/subscriptions' , readAllSubscriptions)
router.patch('/subscriptions/:id', updateSubscription)
router.delete('/subscriptions/:id', deleteSubscription)
router.get('/subscriptions/user/:userId' , readUsersSubscription)

export default router
