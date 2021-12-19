const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const todoSchema = require("../schemas/todoSchema");

const Todo = new mongoose.model("Todo", todoSchema);

// GET ALL THE TODOS
router.get("/", async (req, res) => {
  await Todo.find({}).select({
    _id: 0,
    __v: 0,
    date: 0,
  }).limit(2)
  .exec((err, doc) => {
    if (!err) {
      res.status(200).json({
        data: doc,
      })
    } else {
      res.status(500).json({
        error: "There was a server side error"
      })
    }
  })
});

// GET a TODO by ID
router.get("/:id", async (req, res) => {
  await Todo.find({ _id: req.params.id }, (err, doc) => {
    if (!err) {
      res.status(200).json({
        data: doc
      })
    } else {
      res.status(500).json({
        error: "There was a server side error"
      })
    }
  }).clone();
});

// CREATE a TODO
router.post("/", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save((err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error",
      });
    } else {
      res.status(200).json({
        message: "Todo was inserted successfully!",
      });
    }
  });
});

// Create multiple todos
router.post("/all", async (req, res) => {
  await Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({
        error: "there was a server side error!",
      });
    } else {
      res.status(200).json({
        message: "todos were created successfully!",
      });
    }
  });
});

// UPDATE TODOS
router.put("/:id", async (req, res) => {
  const result = await Todo.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        status: "active",
      },
    },
    {
      new: true,
      useFindAndModify: false,
    },
    (err, doc) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      } else {
        res.status(200).json({
          message: "todo was updated successfully",
          data: doc,
        });
      }
    }
  ).clone();
  console.log(result);
});

// DELETE TODOS
router.delete("/:id", async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id }, (err) => {
    if (!err) {
      res.status(200).json({
        message: 'Todo was deleted successfully',
      })
    } else {
      res.status(500).json({
        error: 'There was a server side error'
      })
    }
  }).clone();
});

module.exports = router;
