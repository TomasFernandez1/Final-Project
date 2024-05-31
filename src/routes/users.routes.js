import RouterClass from './router.js'
import UserController from '../controllers/users.controller.js'
import { uploadFiles } from '../utils/multer.js'

const { getUsers, getUser, deleteUsers, updateUser, uploadDocuments } =
  new UserController()

export default class usersRouter extends RouterClass {
  init() {
    this.get(
      '/upload-documents',
      ['USER', 'ADMIN', 'PREMIUM'],
      async (req, res) => {
        res.render('uploadDocuments', { user: req.user })
      }
    )
    this.get('/', ['ADMIN'], getUsers)

    this.get('/:uid', ['ADMIN'], getUser)
    

    this.put('/:uid/premium', ['ADMIN'], updateUser)

    this.post(
      '/:uid/documents',
      ['USER', 'PREMIUM', 'ADMIN'],
      uploadFiles.any(),
      uploadDocuments
    )

    this.delete('/', ['ADMIN'], deleteUsers)
  }
}
