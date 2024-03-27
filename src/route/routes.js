



const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const categoryController = require("../controllers/categoryController.js")

const subCategoryController = require("../controllers/subCategoryController.js")

//USER 
router.post("/register",  userController.userRegister);
router.post("/login", userController.userLogin);
router.post('/sendMail', userController.forgotPasswordClient);
router.post('/updatePassword/:token', userController.resetPasswordClient);

// Category
router.post("/create/category", categoryController.createCategory);
router.get("/get/category", categoryController.getCategory);
router.put("/update/category/:categoryId", categoryController.updateCategory);
router.delete("/delete/category/:categoryId", categoryController.deleteCategory);

// SubCategory

router.post("/create/subcategory", subCategoryController.createSubCategory);
router.get("/get/subcategory", subCategoryController.getAllSubCategory);
router.put("/update/subcategory/:subCategoryId", subCategoryController.updateSubCategory);
router.delete("/delete/subcategory/:subCategoryId", subCategoryController.deleteSubCategory);

//contact Us
router.post("/contactUs", userController.contactUs)
router.get('/getContactUs', userController.getContactUs)




// router.post("/verification/:userId", userController.emailVerification);
// router.post("/verification2", userController.emailVerification);
// router.post("/verifyOTP", userController.verifyOTP);
// router.post("/reset-password", userController.changePassword);

router.all('*/', function(req, res){
    return res.status(400).send({status:false, message:"Invalid Path"})
})

module.exports = router;