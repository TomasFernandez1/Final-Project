import { Schema, model } from "mongoose";

const cartCollection = "carts";

const cartSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products", 
          required: true, 
        },
        
        quantity: {
          type: Number,
          required: true, 
          min: 0,
        },
      },
    ],
  },
});
cartSchema.pre("findOne", function () {
  this.populate("products.product");
});
export default model(cartCollection, cartSchema);
