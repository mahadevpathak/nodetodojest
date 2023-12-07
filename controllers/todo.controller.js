const todoModel = require("../model/todo.model");

exports.createTodo = async (req, res, next) => {
  try {
    const createModel = await todoModel.create(req.body);
    res.status(201).json(createModel);
  } catch (error) {
    next(error);
  }
};

exports.getTodo = async (req, res, next) => {
  try {
    const allTodos = await todoModel.find({});
    res.status(200).json(allTodos);
  } catch (error) {
    next(error);
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    const todmodel = await todoModel.findById(req.params.todoId);
    if (todmodel) {
      res.status(200).json(todmodel);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};

exports.updateTodo = async (req, res, next) => {
  const todoId = req.params.todoId;
  try {
    const updatedTodo = await todoModel.findByIdAndUpdate(todoId, req.body, {
      new: true,
      useFindAndModify: false,
    });
    if (updatedTodo) {
      res.status(200).json(updatedTodo);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const todoId = req.params.todoId;
    const deletedTodo = await todoModel.findByIdAndDelete(todoId);
    if (deletedTodo) {
        res.status(200).json(deletedTodo);
      } else {
        res.status(404).send();
      }
  } catch (err) {
    next(err);
  }
};
