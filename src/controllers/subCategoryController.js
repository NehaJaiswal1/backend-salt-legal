

const mongoose = require("mongoose");
const categoryModel = require("../models/categoryModel");
const subCategoryModel = require("../models/subCategoryModel");

const createSubCategory = async function (req, res) {
  try {
      let categoryData = req.body;

      let { subCategory, categoryId } = categoryData;

      if (Object.keys(categoryData).length == 0)
          return res.status(400).send({ status: false, message: "Please provide required fields" });

      if (!subCategory)
          return res.status(400).send({ status: false, message: "Subcategory is mandatory" });

      if (typeof subCategory !== "string")
          return res.status(400).send({ status: false, message: "Subcategory should be a string" });

      subCategory = categoryData.subCategory = subCategory.trim();

      if (subCategory === "")
          return res.status(400).send({ status: false, message: "Please enter a subcategory" });

      if (!categoryId)
          return res.status(400).send({ status: false, message: "Category ID is mandatory" });

      categoryId = categoryId.trim();

      if (categoryId === "")
          return res.status(400).send({ status: false, message: "Please enter a category ID" });

      if (!mongoose.Types.ObjectId.isValid(categoryId))
          return res.status(400).send({ status: false, message: "Please enter a valid category ID" });

      const subCategoryCreated = await subCategoryModel.create(categoryData);

      // Update the corresponding category to include the newly created subcategory
      await categoryModel.findByIdAndUpdate(categoryId, { $push: { subCategories: subCategoryCreated._id } });

      return res.status(201).send({
          status: true,
          message: "Subcategory created successfully",
          data: subCategoryCreated
      });
  } catch (error) {
      console.log(error.message);
      return res.status(500).send({ status: false, message: error.message });
  }
};


const getAllSubCategory = async function (req, res) {
    try {
        let filter = { isDeleted: false };
        let savedData = await subCategoryModel.find(filter)
        if (savedData.length === 0) {
            return res.status(404).send({ status: false, msg: "Sub Category Not Available" });
        } else {
            return res.status(200).send({ status: true, data: savedData });
        }
    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
};

const updateSubCategory = async function (req, res) {
    try {
      const data = req.body;
      const subCategoryId = req.params.subCategoryId;
      const deletedData = await subCategoryModel.findById(subCategoryId);
      if (deletedData.isDeleted == true) {
        return res
          .status(200)
          .send({ status: false, msg: "category already deleted" });
      }
      const updatedCategoryData = await subCategoryModel.findOneAndUpdate(
        { _id: subCategoryId },
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

  const deleteSubCategory = async function (req, res) {
    try {
    
      const subCategoryId = req.params.subCategoryId;
      const deletedData = await subCategoryModel.findById(subCategoryId);
      if (deletedData.isDeleted == true) {
        return res
          .status(200)
          .send({ status: false, msg: "category already deleted" });
      }
      const deleteCategoryData = await subCategoryModel.findOneAndUpdate(
        { _id: subCategoryId },
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
  
module.exports = {
  createSubCategory,
  getAllSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
