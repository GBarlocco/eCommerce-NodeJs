const fs = require('fs');

class Contenedor {
    constructor(archivo) {
        this.archivo = archivo;
    }

    async read() {
        try {
            let data = await fs.promises.readFile(`./${this.archivo}`, `utf-8`);
            return data;

        } catch (err) {
            throw Error(`Error al leer el archivo ${err}`);
        }
    }

    async write(datos, msg) {
        try {
            await fs.promises.writeFile(`./${this.archivo}`, JSON.stringify(datos, null, 2));
            console.log(msg);
        } catch (err) {
            throw Error(`Error al escribir en el archivo ${err}`);
        }
    }

    async create() {
        let newCart;
        let date = new Date.toDateString();
        let cart = {
            id: 0,
            timestamp: date,
            products: []
        };

        let data = await this.read();
        let datos = JSON.parse(data);

        if (datos.length == 0) {
            cart.id = 1;
            newCart = cart;
        } else {
            cart.id = datos[datos.length - 1].id + 1;
            newCart = cart;
        }
        datos.push(newCart);

        await this.write(datos, `Agregado!`);

        return cart.id;
    }

    async getProductsByID(myId) {

        let data = await this.read();
        let datos = JSON.parse(data);

        let result = datos.filter(cart => cart.id == myId);
        if (result.length == 0) {
            return [];
        } else {
            return result[0].products;
        }
    }

    async getCartById(myId) {

        let data = await this.read();
        let datos = JSON.parse(data);

        let result = datos.filter(cart => cart.id == myId);

        return result;
    }

    async getAll() {
        let data = await this.read();
        let datos = JSON.parse(data);

        return datos;
    }

    async deleteById(myId) {
        let data = await this.read();
        let datos = JSON.parse(data);

        let product = datos.find(product => product.id == myId);
        if (product) {
            let index = datos.indexOf(product);
            console.log(index);
            datos.splice(index, 1);
            await this.write(datos, `Producto con ID: ${myId} eliminado`)
        } else {
            console.log(`Producto con ID: ${myId} no existe`);
        }
    }

    async deleteAll() {
        let data = [];
        await this.write(data, `Se eliminaron todos los productos`);
    }
}
module.exports = Contenedor;