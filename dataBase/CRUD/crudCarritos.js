const mongoDB = require(`../mongoDB`);
const cartModel = require(`../models/carrito`);
const productsModel = require(`../models/producto`);

class Contenedor {
    constructor() {
    }

    async createCart() {
        let date = new Date();
        let newCart = {
            timestamp: date,
            products: []
        };

        // Instancia del modelo carrito
        const cart = new cartModel(newCart);

        mongoDB
            .then(_ => cart.save())
            .then(document => document._id.toString())
            .catch(err => console.log(`Error: ${err.message}`));
    }

    async getProductsByID(idCart) {
        try {
            let docs = false
            docs = await cartModel.findOne({ _id: idCart }, { __v: 0 });
            if (docs) {
                return docs.products;
            } else {
                return false;
            }
        } catch (error) {
            throw Error(`Error en getById`);
        }
    }

    async deleteCartById(idCart) {
        mongoDB
            .then(_ => cartModel.deleteOne({
                _id: idCart
            }))
            .then(result => console.log(result))
            .catch(err => console.log(`Error: ${err.message}`))
    }

    async addProduct(idCart, idProduct) {
        try {
            let docCart = false;
            let docProduct = false

            docCart = await cartModel.findOne({ _id: idCart }, { __v: 0 });
            docProduct = await productsModel.findOne({ _id: idProduct }, { __v: 0 });

            if (docCart && docProduct) {

                docCart.products.push(docProduct);
                return docCart.save();
            } else {
                throw Error(`Error al acceder al id del carrito / producto`);
            }

        } catch (error) {
            throw Error(`Error en addProduct`);
        }
    }

    async deleteProductById(idCart, idProduct) {
        try {
            let docCart = false;
            let docProduct = false

            docCart = await cartModel.findOne({ _id: idCart }, { __v: 0 });
            docProduct = await productsModel.findOne({ _id: idProduct }, { __v: 0 });

            if (docCart && docProduct) {
                let allProductsFromCart = docCart.products;
                let products = [];

                for (let i = 0; i <= allProductsFromCart.length - 1; i++) {
                    if (allProductsFromCart[i]._id.toString() != docProduct._id.toString()) {
                        products.push(allProductsFromCart[i]);
                    }
                }
                docCart.products = products;
                return docCart.save();
            } else {
                throw Error(`Error al acceder al id del carrito / producto`);
            }
        } catch (err) {
            throw Error(`Error  ${err}`);
        }
    }

}
module.exports = Contenedor;
