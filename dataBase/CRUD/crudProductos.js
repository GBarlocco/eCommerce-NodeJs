const mongoDB = require(`../mongoDB`);
const productsModel = require(`../models/producto`);

class Contenedor {
    constructor() {
    }

    async save(product) {
        // Instancia del modelo Producto
        product = new productsModel(product);

        mongoDB
            .then(_ => product.save())
            .then(document => document)
            .catch(err => console.log(`Error: ${err.message}`));
    }

    async getAll() {
        try {
            let docs = false;
            docs = await productsModel.find();
            if (docs) {
                return docs;
            } else {
                return false;
            }
        } catch (error) {
            throw Error(`Error en getAll`);
        }
    }

    async getById(idProduct) {
        try {
            let doc = false;
            doc = await productsModel.findOne({ _id: idProduct }, { __v: 0 });

            if (doc) {
                return doc;
            } else {
                return false;
            }
        } catch (error) {
            throw Error(`Error Producto no encontrado`);
        }
    }

    async deleteById(idProduct) {
        mongoDB
            .then(_ => productsModel.deleteOne({
                _id: idProduct
            }))
            .catch(err => console.log(`Error: ${err.message}`))
    }


    async updateById(idProduct, name, price, url, description, date, code, stock) {

        mongoDB
            .then(_ => productsModel.findOne({ _id: idProduct }, { __v: 0 }))
            .then(product => {
                product.nombre = name;
                product.precio = price;
                product.url = url;
                product.descripcion = description;
                product.date = date;
                product.codigo = code;
                product.stock = stock;

                return product.save();
            })
            .catch(err => console.log(`Error: ${err.message}`))
    }

}
module.exports = Contenedor;