const mongoDB = require(`../mongoDB`);
const productsModel = require(`../models/producto`);

const { queryProductos } = require(`../firebaseDB`);

class Contenedor {
    constructor() {
    }

    //LISTO, PROBADA
    async save(product) {
        try {
            const newProduct = await queryProductos.add(product);
        } catch (e) {
            throw Error(`Error en save: ${e.message}`);
        }
    }

    //LISTO, PROBADA
    async getAll() {
        try {
            const docsProducts = await queryProductos.get();

            const allProducts = docsProducts.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            });
            return allProducts;
        } catch (e) {
            throw Error(`Error en getAll: ${e.message}`);
        }
    }

    //LISTO, PROBADA
    async getById(idProduct) {
        const docsProducts = queryProductos.doc(idProduct);
        try {
            const response = await docsProducts.get();

            const product = {
                id: response.id,
                ...response.data()
            };
            return product;
        } catch (e) {
            throw Error(`Error en getById: ${e.message}`);
        }
    }

    //LISTO, PROBADA
    async updateById(idProduct, name, price, url, description, date, code, stock) {
        const docsProducts = queryProductos.doc(idProduct);
        try {
            const productUpdate = await docsProducts.update({
                nombre: name,
                precio: price,
                thumbnail: url,
                descripcion: description,
                timestamp: date,
                codigo: code,
                stock: stock
            });
        } catch (e) {
            throw Error(`Error en updateById: ${e.message}`);
        }
    }

    //LISTO, PROBADA
    async deleteById(idProduct) {
        console.log(idProduct);
        const docsProducts = queryProductos.doc(idProduct);
        try {
            const productDelete = await docsProducts.delete();
        } catch (e) {
            throw Error(`Error en deleteById: ${e.message}`);
        }
    }
}
module.exports = Contenedor;