const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const todoSchema = require("../schemas/todoSchema");
const checkLogin = require("../middlewares/checkLogin");

const Todo = new mongoose.model("Todo", todoSchema);

// GET ACTIVE TODOS
router.get("/active", async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  res.status(200).json({
    data,
  });
});

router.get("/js", async (req, res) => {
  const data = await Todo.findByJs();
  res.status(200).json({
    data,
  });
});

// GET INACTIVE TODOS with callback
router.get("/inactive", (req, res) => {
  const todo = new Todo();
  todo.findInActive((err, doc) => {
    if (!err) {
      res.status(200).json({
        data: doc,
      });
    } else {
      res.status(500).json({
        error: "There was a server side error!",
      });
    }
  });
});

// GET ALL THE TODOS
router.get("/", checkLogin, (req, res) => {
  console.log("username", req.username);
  console.log("userId", req.userId);
  Todo.find({})
    .select({
      _id: 0,
      __v: 0,
      date: 0,
    })
    .limit(2)
    .exec((err, doc) => {
      if (!err) {
        res.status(200).json({
          data: doc,
        });
      } else {
        res.status(500).json({
          error: "There was a server side error",
        });
      }
    });
});

// GET TODOS BY LANGUAGE
router.get("/language", (req, res) => {
  const data = new Todo.find().byLanguage("js");

  res.status(200).json({
    data,
  });
});

// GET a TODO by ID
router.get("/:id", async (req, res) => {
  try {
    const doc = await Todo.find({ _id: req.params.id });
    res.status(200).json({
      data: doc,
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

// CREATE a TODO
router.post("/", (req, res) => {
  const newTodo = new Todo(req.body);
  newTodo.save((err) => {
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
router.post("/all", (req, res) => {
  Todo.insertMany(req.body, (err) => {
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
  const result = Todo.findByIdAndUpdate(
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
  Todo.deleteOne({ _id: req.params.id }, (err) => {
    if (!err) {
      res.status(200).json({
        message: "Todo was deleted successfully",
      });
    } else {
      res.status(500).json({
        error: "There was a server side error",
      });
    }
  }).clone();
});

module.exports = router;
