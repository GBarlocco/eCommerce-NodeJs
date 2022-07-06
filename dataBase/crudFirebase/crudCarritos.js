const { queryCarritos, queryProductos, FieldValue } = require(`../firebaseDB`);

class Contenedor {
    constructor() {
    }

    //LISTO, PROBADA
    async createCart() {
        let date = new Date();
        let newCart = {
            timestamp: date,
            products: []
        };

        try {
            const carrito = await queryCarritos.add(newCart);
        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    }

    async addProduct(idCart, idProduct) {
        const docCarts = queryCarritos.doc(idCart);
        const docProducts = queryProductos.doc(idProduct);

        try {
            const response = await docProducts.get();
            const product = {
                id: response.id,
                ...response.data()
            };

            const docsCarts = await queryCarritos.get();

            let allProducts = docsCarts.docs.map(doc => {
                return doc.data().products;
            });
            console.log('Todos los productos en el carrito:');
            console.log(allProducts);

            allProducts.push(product);
            console.log('Carrito actualizado:');
            console.log(allProducts);

            await docCarts.update({
                'products': FieldValue.arrayUnion([])
            });

            await docCarts.update({
                'products': FieldValue.arrayUnion(allProducts)
            });

        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    }

    //LISTO, PROBADA
    async deleteCartById(idCart) {
        const docsCart = queryCarritos.doc(idCart);
        try {
            const productDelete = await docsCart.delete();
        } catch (e) {
            throw Error(`Error en deleteById: ${e.message}`);
        }
    }

    /*

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
    */

}
module.exports = Contenedor;
