const express = require(`express`);
const { Router } = express;

const CrudProductos = require(`./dataBase/crudProductos`);

const CrudCarritos = require(`./dataBase/crudCarritos`);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`public`));

const productosRouter = Router();
const carritoRouter = Router();

app.use(`/api/productos`, productosRouter);
app.use(`/api/carrito`, carritoRouter);

app.use(express.static(`public`));

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => console.log(`Servidor HHTP escuchando puerto ${PORT}`));

server.on(`error`, err => console.log(`error en el servidor ${err}`));

let myCrudProductos = new CrudProductos(`./dataBase/productos.txt`);
let myCrudCarritos = new CrudCarritos(`./dataBase/carritos.txt`);
let administrator = true;

productosRouter.get(`/`, async (req, res) => {
    try {
        let allProducts = await myCrudProductos.getAll();
        return res.json(allProducts);
    } catch (err) {
        return res.status(404).json({
            error: `Error ${err}`
        });
    }
});

productosRouter.get(`/:id`, async (req, res) => {
    try {
        let productbyId = await myCrudProductos.getById(req.params.id);
        if (productbyId.length == 0) {
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
});

productosRouter.post(`/`, async (req, res) => {
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

        return res.json(`El id asignado es ${id}`);
    } catch (err) {
        return res.status(404).json({
            error: `Error ${err}`
        });
    }
});

productosRouter.put(`/:id`, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const name = req.body.nombre;
        const price = Number(req.body.precio);
        const url = req.body.thumbnail;
        const description = req.body.descripcion;
        const date = new Date().toDateString();
        const code = Number(req.body.codigo);
        const stock = Number(req.body.stock);

        let allProducts = await myCrudProductos.getAll();
        const productIndex = allProducts.findIndex(product => product.id === id);

        if (productIndex < 0) {
            return res.status(401).json({
                error: "producto no encontrado"
            });
        }
        allProducts[productIndex].nombre = name;
        allProducts[productIndex].thumbnail = url;
        allProducts[productIndex].timestamp = date;
        allProducts[productIndex].descripcion = description;
        allProducts[productIndex].codigo = code;
        allProducts[productIndex].precio = price;
        allProducts[productIndex].stock = stock;

        await myCrudProductos.write(allProducts, `Mensaje modificado`);
        return res.json(`Se actualizó el id ${id}`);

    } catch (err) {
        return res.status(404).json({
            error: `Error ${err}`
        });
    }
});

productosRouter.delete(`/:id`, async (req, res) => {
    try {
        const id = Number(req.params.id);
        await myCrudProductos.deleteById(id);

        return res.json(`Se eliminó de forma correcta el ID:${id}`);
    } catch (err) {
        return res.status(404).json({
            error: `Error ${err}`
        });
    }
});

carritoRouter.get(`/:id/productos`, async (req, res) => {
    if (administrator) {
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
    } else {
        return res.status(404).json({
            error: `Ruta no permitida, no es usuario con perfil administrador.`
        });
    }
});

carritoRouter.post(`/`, async (req, res) => {
    if (administrator) {
        try {
            const id = await myCrudCarritos.createCart();
            return res.json(`Nuevo carrito asignado, ID: ${id}`);
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
});

carritoRouter.post(`/:idCar/:idProd`, async (req, res) => {
    if (administrator) {
        try {
            let idCart = Number(req.params.idCar);
            let idProduct = req.params.idProd;

            let allCarts = await myCrudCarritos.getAll();

            const cartIndex = allCarts.findIndex(cart => cart.id === idCart);

            if (cartIndex < 0) {
                return res.status(401).json({
                    error: "carrito no encontrado"
                });
            };

            let cart = await myCrudCarritos.getCartById(idCart);

            if (cart.length == 0) {
                return res.status(404).json({
                    error: `Error no se encontro el carrito`
                });
            };

            let productbyId = await myCrudProductos.getById(idProduct);

            if (productbyId.length == 0) {
                return res.status(404).json({
                    error: `Error producto no encontrado`
                });
            };

            allCarts[cartIndex].products.push(productbyId[0]);

            await myCrudCarritos.write(allCarts, `producto agregado al carrito`);
            return res.json(`Se agregó el producto con id ${idProduct} al carrito con id ${idCart}`);

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
});

carritoRouter.delete(`/:id`, async (req, res) => {
    if (administrator) {
        try {
            const idCart = Number(req.params.id);

            await myCrudCarritos.deleteCartById(idCart);
            return res.json(`Se eliminó de forma correcta el carrito con ID:${idCart}`);
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
});

carritoRouter.delete(`/:id/productos/:id_prod`, async (req, res) => {
    if (administrator) {
        try {
            const idCart = Number(req.params.id);
            const idProduct = Number(req.params.id_prod);

            await myCrudCarritos.deleteProductById(idCart, idProduct);

            return res.json(`Producto  con ID: ${idProduct} del carrito con ID ${idCart} fue eliminado`);
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
});