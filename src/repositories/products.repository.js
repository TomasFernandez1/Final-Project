import productDto from '../dtos/product.dto.js'


export default class ProductRepository{
    constructor(dao){
        this.dao = dao;
    }

    getProduct = async (limit, page, sort) => {
        return await this.dao.get(limit, page, sort);
    }

    getProductById = async (id) => {
        return await this.dao.getById(id)
    }

    createProduct = async (newP) =>{
        const newProduct = new productDto(newP)
        return await this.dao.create(newProduct)
    }

    updateProduct = async (id, updatedP) => {
        return await this.dao.update(id, updatedP)
    }

    deleteProduct = async (id) => {
        return await this.dao.delete(id)
    }

}