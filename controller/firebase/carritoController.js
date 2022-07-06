//Para realizar CRUD con firebase:
const CrudCarritos = require(`../../dataBase/crudFirebase/crudCarritos`);

let myCrudCarritos = new CrudCarritos();

const getAllProductsByIdCartF = async (req, res) => {
    try {
        let idCart = req.params.id;
        let productsbyId = await myCrudCarritos.getProductsByID(idCart);

        if (productsbyId.length == 0) {
            return res.json(`El carrito se encuentra vacío`);
        } else {
            return res.json(productsbyId);
        }
    } catch (err) {
        return res.status(404).json({
            error: `Error ${err}`
        });
    }
};

const createCartF = async (req, res) => {
    try {
        const id = await myCrudCarritos.createCart();
        return res.json(`Nuevo carrito creado`);
    } catch (err) {
        return res.status(404).json({
            error: `Error ${err}`
        });
    }
};

const addProductF = async (req, res) => {
    try {
        let idCart = req.params.idCar;
        let idProduct = req.params.idProd;

        await myCrudCarritos.addProduct(idCart, idProduct);

        return res.json(`Se agregó el producto con id ${idProduct} al carrito con id ${idCart}`);
    } catch (err) {
        return res.status(404).json({
            error: `Error ${err}`
        });
    }
};

const deleteCartByIdF = async (req, res) => {
    try {
        const idCart = req.params.id;

        await myCrudCarritos.deleteCartById(idCart);
        return res.json(`Se eliminó de forma correcta el carrito`);
    } catch (err) {
        return res.status(404).json({
            error: `Error ${err}`
        });
    }
};

const deleteProductByIdF = async (req, res) => {
    try {
        const idCart = req.params.id;
        const idProduct = req.params.id_prod;

        await myCrudCarritos.deleteProductById(idCart, idProduct);

        return res.json(`Producto  con ID: ${idProduct} del carrito con ID ${idCart} fue eliminado`);
    } catch (err) {
        return res.status(404).json({
            error: `Error ${err}`
        });
    }
};

module.exports = {
    getAllProductsByIdCartF,
    createCartF,
    addProductF,
    deleteCartByIdF,
    deleteProductByIdF
};