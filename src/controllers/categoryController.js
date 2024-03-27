


const mongoose = require('mongoose');
const categoryModel = require("../models/categoryModel");

const createCategory = async function (req, res) {
    try {
        let categoryData = req.body;

        let { title } = categoryData;

        if (Object.keys(categoryData).length == 0)
            return res.status(400).send({ status: false, message: "please provide required fields" });


        if (!title)
            return res.status(400).send({ status: false, message: " title is mandatory" });

        if (typeof title != "string")
            return res.status(400).send({ status: false, message: " title should be in string" });

        
        title = categoryData.title = title.trim();

        if (title == "")
            return res.status(400).send({ status: false, message: "Please Enter  title" });


      
        const categoryCreated = await categoryModel.create(categoryData);

        return res.status(201).send({ status: true, message: "Category created succesfully", data: categoryCreated });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ status: false, message: error.message });
    }
};


// const getCategory = async function (req, res) {
//     try {
        
//     let filter = { isDeleted: false}
//     let savedData = await categoryModel.find(filter)
//     if (savedData.length == 0) {
//         return res.status(404).send({ status: false, msg: "Such Category Not Available" })
//     } else {
//         return res.status(200).send({ status: true, data: savedData })
//     }
//     } catch (err) {
//         return res.status(500).send({ status: false, error: err.message });
//     }
// };


const getCategory = async function (req, res) {
  try {
      let filter = { isDeleted: false };
      let savedData = await categoryModel.find(filter).populate('subCategories');
      if (savedData.length === 0) {
          return res.status(404).send({ status: false, msg: "Such Category Not Available" });
      } else {
          return res.status(200).send({ status: true, data: savedData });
      }
  } catch (err) {
      return res.status(500).send({ status: false, error: err.message });
  }
};

const updateCategory = async function (req, res) {
    try {
      const data = req.body;
      const categoryId = req.params.categoryId;
      const deletedData = await categoryModel.findById(categoryId);
      if (deletedData.isDeleted == true) {
        return res
          .status(200)
          .send({ status: false, msg: "category already deleted" });
      }
      const updatedCategoryData = await categoryModel.findOneAndUpdate(
        { _id: categoryId },
        {
          $set: {
            title: data.title,
          }
        },
        { new: true }
      );
  
      res.status(200).send({ status: true, data: updatedCategoryData });
    } catch (error) {
      res.status(500).send({ status: false, msg: error.message });
    }
  };
  

  const deleteCategory = async function (req, res) {
    try {
    
      const categoryId = req.params.categoryId;
      const deletedData = await categoryModel.findById(categoryId);
      if (deletedData.isDeleted == true) {
        return res
          .status(200)
          .send({ status: false, msg: "category already deleted" });
      }
      const deleteCategoryData = await categoryModel.findOneAndUpdate(
        { _id: categoryId },
        { $set: { isDeleted: true }, deletedAt: new Date() },
        { new: true }
      );

    //   let deletedBlog = await blogModel.findOneAndUpdate(
    //     { _id: blogId },
    //     { $set: { isDeleted: true }, deletedAt: new Date() },
    //     { new: true }
    //   );
  
      res.status(200).send({ status: true, data: deleteCategoryData });
    } catch (error) {
      res.status(500).send({ status: false, msg: error.message });
    }
  };
  


module.exports = { createCategory, getCategory, updateCategory , deleteCategory}