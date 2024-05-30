
export default class UserRepository {
  constructor(dao) {
    this.dao = dao
  }

  getUsers = async (filters) => {
    return await this.dao.get(filters)
  }

  getByEmail = async (email) => {
    return await this.dao.getBy(email)
  }

  getById = async (uid) => {
    return await this.dao.getById(uid)
  }
  createUser = async (newUser) => {
    return await this.dao.create(newUser)
  }
  

  updateUser = async (uid, updatedUser) => {
    return this.dao.update(uid, updatedUser)
  }

  deleteUser = async (uid) => {
    return this.dao.delete(uid)
  }
}
