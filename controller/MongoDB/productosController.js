const CrudProductos = require(`../../dataBase/crudMongoDB/crudProductos`);

let myCrudProductos = new CrudProductos();
let administrator = true;

const getAllProducts = async (req, res) => {
    try {
        let allProducts = await myCrudProductos.getAll();
        return res.json(allProducts);
    } catch (err) {
        return res.status(404).json({
            error: `Error ${err}`
        });
    }
}

const getProductById = async (req, res) => {
    try {
        let idCart = req.params.id;
        let productbyId = await myCrudProductos.getById(idCart);

        if (!productbyId) {
            return res.status(404).json({
                error: `Error producto no encontrado`
            });
        } else {
            return res.json(productbyId);
        }
    } catch (err) {
        return res.status(404).json({
            error: `Error ${err}`
        });
    }
}

const addProduct = async (req, res) => {
    if (administrator) {
        try {
            const name = req.body.nombre;
            const price = Number(req.body.precio);
            const url = req.body.thumbnail;
            const description = req.body.descripcion;
            const date = new Date().toDateString();
            const code = Number(req.body.codigo);
            const stock = Number(req.body.stock);

            const newProducto = {
                timestamp: date,
                nombre: `${name}`,
                descripcion: `${description}`,
                codigo: code,
                thumbnail: `${url}`,
                precio: price,
                stock: stock
            };
            const id = await myCrudProductos.save(newProducto);

            return res.json(`Se agregó el nuevo producto`);
        } catch (err) {
            return res.status(404).json({
                error: `Error ${err}`
            });
        }
    } else {
        return res.status(404).json({
            error: `Ruta no permitida, no es usuario con perfil administrador.`
        });
    }
}

const updateProductById = async (req, res) => {
    if (administrator) {
        try {
            const idProduct = req.params.id;
            const name = req.body.nombre;
            const price = Number(req.body.precio);
            const url = req.body.thumbnail;
            const description = req.body.descripcion;
            const date = new Date().toDateString();
            const code = Number(req.body.codigo);
            const stock = Number(req.body.stock);

            await myCrudProductos.updateById(idProduct, name, price, url, description, date, code, stock);

            return res.json(`Se actualizó el producto `);

        } catch (err) {
            return res.status(404).json({
                error: `Error ${err}`
            });
        }
    } else {
        return res.status(404).json({
            error: `Ruta no permitida, no es usuario con perfil administrador.`
        });
    }
}

const deleteProductById = async (req, res) => {
    if (administrator) {
        try {
            const id = req.params.id;
            await myCrudProductos.deleteById(id);
            return res.json(`Se eliminó de forma correcta el ID:${id}`);
        } catch (err) {
            return res.status(404).json({
                error: `Error ${err}`
            });
        }
    } else {
        return res.status(404).json({
            error: `Ruta no permitida, no es usuario con perfil administrador.`
        });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProductById,
    deleteProductById,
};

