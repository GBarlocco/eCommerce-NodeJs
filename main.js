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

const PORT = 8080;

const server = app.listen(PORT, () => console.log(`Servidor HHTP escuchando puerto ${PORT}`));

server.on(`error`, err => console.log(`error en el servidor ${err}`));


let myCrudProductos = new CrudProductos(`./dataBase/productos.txt`);
let myCrudCarritos = new CrudCarritos(`./dataBase/carritos.txt`);

productosRouter.get(`/`, (req, res) => {
    ; (async () => {
        try {
            let allProducts = await myCrudProductos.getAll();
            return res.json(allProducts);
        } catch (err) {
            return res.status(404).json({
                error: `Error ${err}`
            });
        }
    })();
});

productosRouter.get(`/:id`, (req, res) => {
    ; (async () => {
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
    })();
});


productosRouter.post(`/`, (req, res) => {
    ; (async () => {
        const name = req.body.nombre;
        const price = Number(req.body.precio);
        const url = req.body.url;


        const newProducto = {
            title: `${name}`,
            price: price,
            thumbnail: `${url}`
        };
        const id = await myCrudProductos.save(newProducto);

        return res.json(`El id asignado es ${id}`);
    })();
});

productosRouter.put(`/:id`, (req, res) => {
    ; (async () => {
        const id = Number(req.params.id);
        let allProducts = await myCrudProductos.getAll();
        const productIndex = allProducts.findIndex(product => product.id === id);

        if (productIndex < 0) {
            return res.status(401).json({
                error: "producto no encontrado"
            });
        }

        allProducts[productIndex].title = req.body.title;
        allProducts[productIndex].price = req.body.price;
        allProducts[productIndex].thumbnail = req.body.thumbnail;

        await myCrudProductos.write(allProducts, `Mensaje modificado`);
        return res.json(`Se actualizó el id ${id}`);
    })();
});

productosRouter.delete(`/:id`, (req, res) => {
    ; (async () => {
        try {
            const id = Number(req.params.id);
            await myCrudProductos.deleteById(id);

            return res.json(`Se eliminó de forma correcta el ID:${id}`);
        } catch (err) {
            return res.status(404).json({
                error: `Se detecto un error --> ${err}`
            });
        }
    })();
});

carritoRouter.get(`/:id/productos`, (req, res) => {
    ; (async () => {
        try {
            let productsbyId = await myCrudCarritos.getProductsByID(req.params.id);
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
    })();
});

carritoRouter.post(`/`, (req, res) => {
    ; (async () => {
        const id = await myCrudCarritos.create();
        return res.json(`Nuevo carrito asignado, ID: ${id}`);
    })();
});


carritoRouter.post(`/:idCar/:idProd`, (req, res) => {
    ; (async () => {
        let idCart = Number(req.params.idCar);
        let idProduct = req.params.idProd;

        try {
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
    })();
});

carritoRouter.delete(`/:id`, (req, res) => {
});

carritoRouter.delete(`/:id/productos/:id_prod`, (req, res) => {
});