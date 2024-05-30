import RouterClass from './router.js'
import UserController from '../controllers/users.controller.js'

const { getUsers, getUser, deleteUsers, updateUser } = new UserController()

export default class usersRouter extends RouterClass {
  init() {

    // Every 24hs it will delete users 
    // who have not logged in for 2 days
    setInterval(deleteUsers, 86400000);
    
    this.get('/', ['ADMIN'], getUsers)
    
    this.get('/:uid', ['ADMIN'], getUser)
    
    this.put('/:uid', ['ADMIN'], updateUser)

    this.delete('/', ['ADMIN'], deleteUsers) // Delete users manually
    
  }
}