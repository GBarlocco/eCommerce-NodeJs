import queryProductos from '..nofirebaseDB';

try {
    const carrito = queryProductos.add({
        nombre: "Productoa1231212312sdasdass*****",
        descripcion: "descripcion1",
        codigo: 1,
        thumbnail: url1,
        precio: 1,
        stock: 1
    });

    console.log(carrito);

} catch (e) {
    console.log(`Error ${e}`)
}

