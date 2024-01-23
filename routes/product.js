const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchUser');
const Product = require('../models/Product')
const { body, validationResult } = require('express-validator');



// Route 1 : Get All the Product using GET "/api/Product/fetchAllProduct". Login required
router.get('/fetchAll', fetchuser, async (req, res) => {
    try {
        const product = await Product.find();
        res.json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

router.get('/findById/:id', fetchuser, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// Router 2 : Add a new Product using POST "api/Product/addNote". Login required
router.post('/addProduct', fetchuser, [
    body('title', "Enter valid title..").isLength({ min: 5 }),
    body('description', "Enter minmium 5 length description").isLength({ min: 5 }),

], async (req, res) => {
    try {

        // console.log(req);
        if ("user" !== req.user.role) {
            // console.log("Admin")
            const { title, description, img, price } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const product = new Product({
                title, description, img, price
            })

            const savedProduct = await product.save();
            res.json({ "success": "Product added", savedProduct });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// Route 3 : Update an existing Note using POST "/api/Product/updateNote". Login required
router.put('/updateProduct/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, img, price } = req.body;
        // Create a new product object
        const newProduct = {};
        if (title) { newProduct.title = title }
        if (description) { newProduct.description = description }
        if (img) { newProduct.img = img }
        if (price) { newProduct.price = price }

        // Find the note to be updated
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Not Found...");
        }
        if (req.user.role !== "admin") {
            return res.status(401).send("Not allowed...");
        }

        const updateProduct = await Product.findByIdAndUpdate(req.params.id, { $set: newProduct }, { new: true });
        res.json({ "success": "Product updated", updateProduct });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

});

// Route 4 : Delete an existing Note using Delete "/api/Product/deleteNote". Login required
router.delete('/deleteProduct/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete
        // console.log("Delete")
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Not Found...");
        }

        // Allow deletion only if user owns this note
        console.log(req.user)
        if ("admin" !== req.user.role) {
            return res.status(401).send("Not allowed...");
        }

        const deleteNote = await Product.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted..." });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});


module.exports = router;