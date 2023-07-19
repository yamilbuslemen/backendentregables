import { Router } from "express";
import { ProductManager } from "../../src/dao/productManager.js";
import { __dirname } from '../utils.js';

const productService = new ProductManager('/products.json');
const router = Router();

// Valido los campos
const validateFields = (req, res, next) => {
    const productInfo = req.body;
    if (!productInfo.title || !productInfo.description || !productInfo.price || !productInfo.code || !productInfo.stock || !productInfo.status || !productInfo.category) {
        return res.json({ status: "error", message: "Campos incompletos! Complete los mismos." })
    } else {
        next();
    }
};


// Obtengo los prod de acuerdo al limite de prod que ingrese. Si no ingresa limite => todos
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const result =  await productService.getProducts();
        let resultado = 0;
        if (limit) {
            
            //devolver productos de acuerdo al limite
            const limite = parseInt(req.query.limit);
            console.log("limite: ", limite);
            if (limite > 0) {
                resultado = result.slice(0,limite);
            } else {
                resultado = result;
            }
            res.send(resultado);

        } else {
            res.json({ status: "success", data: result });
        }
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

// Retorno el prod por id: http://localhost:8080/api/products/4b3d41e8-d374-4569-b30f-13f91bc7edb2
router.get("/:pid", async (req, res) => {
    try {
        let pid = req.params.pid;
        let result = await productService.getProductById(pid);
        res.json({ status: 'success', data: result });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
        //throw new Error(error.message);
    }
});



// Doy de alta el producto
router.post("/", validateFields, async (req, res) => {
    try {
        const productInfo = req.body;
        const productCreated =  await productService.addProduct(productInfo);

        // Emitir el evento al servidor de websockets. Lo podría encontrar si en app así lo declarara como
        // io.emit('nuevoProducto', productCreated); -> ese io sería como se nombra en app.js.
        //socketClient.emit('nuevoProducto', productCreated);

        res.json({ status: "success", data: productCreated, message: "Producto creado satisfactoriamente!" });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

// Actualizo el producto segun id
router.put("/:pid", validateFields,  (req, res) => {
    try {
        let pid = req.params.pid;
        let product = req.body;
        let result =  productService.updateProduct(pid, product);
        result.id = pid;

        // Emitir el evento al servidor de websockets
        //socketClient.emit('actualizoProducto', result);

        res.json({ status: 'success', data: result });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
        //throw new Error(error.message);
    }
});

// Doy de baja el producto segun ID
router.delete("/:pid", (req, res) => { 
    try {
        let pid = req.params.pid;
        let result =  productService.deleteProduct(pid);

        // Emitir el evento al servidor de websockets
        //socketClient.emit('bajaProducto', result);

        res.json({ status: "success", data: deleteProduct, message: "Producto borrado!" });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

export { router as productsRouter }