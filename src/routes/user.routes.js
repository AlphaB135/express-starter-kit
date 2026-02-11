##############################################################################
# User Routes
##############################################################################

import express from 'express'
import { getUsers } from '../controllers/user/getUsers.js'
import { getUser } from '../controllers/user/getUser.js'
import { updateUser } from '../controllers/user/updateUser.js'
import { deleteUser } from '../controllers/user/deleteUser.js'
import { updatePassword } from '../controllers/user/updatePassword.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

# All routes require authentication
router.use(protect)

router.get('/me', getUser)
router.patch('/me', updateUser)
router.patch('/me/password', updatePassword)

# Admin only routes
router.get('/', authorize('admin'), getUsers)
router.get('/:id', authorize('admin'), getUser)
router.patch('/:id', authorize('admin'), updateUser)
router.delete('/:id', authorize('admin'), deleteUser)

export { router as userRoutes }
