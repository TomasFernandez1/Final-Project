export default class CartRepository{
    constructor(dao){
        this.dao = dao
    }

    getCart = async () => {
        return await this.dao.get()
    }

    getById = async (id) => {
        return await this.dao.getBy(id)
    }

    createCart = async () => {
        return await this.dao.create()
    }

    updateCart = async (pID, cID) => {
        return await this.dao.update(pID, cID)
    }

    deleteCart = async (cID) => {
        return await this.dao.delete(cID)
    }

    deleteProductCart = async (cID, pID) => {
        return await this.dao.deleteOneProduct(cID, pID)
    }

    deleteProductsCart = async (cID) => {
        return await this.dao.deleteAllProducts(cID);
    }
}