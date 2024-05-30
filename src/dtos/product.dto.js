import { faker } from '@faker-js/faker'

export default class ProductDTO {
    constructor(product){
        this.title = product.title
        this.description = product.description
        this.category = product.category
        this.stock = product.stock
        this.price = product.price
        this.owner = product.owner
        this.thumbnail = product.thumbnail
        this.code = faker.string.alphanumeric({ length: {min: 3, max: 3} })
        this.isActive = product.isActive
    }
}