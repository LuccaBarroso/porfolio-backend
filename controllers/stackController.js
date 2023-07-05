import Stack from "../models/stackModel.js";

export function getAll(req, res) {
  Stack.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving stacks.",
      });
    else res.send(data);
  });
}

export function getById(req, res) {
  if(!req.params.id) 
    res.status(400).send({ message: "Id can not be empty!" });
  Stack.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found stack with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving stack with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
}

export function create(req, res) {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  const newStack = new Stack({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
  });

  Stack.create(newStack, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the stack.",
      });
    else res.send(data);
  });
}

export function update(req, res) {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  Stack.updateById(req.params.id, new Stack(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Not found stack with id ${req.params.id}.` });
      } else {
        res.status(500).send({
          message: "Error updating stack with id " + req.params.id,
        });
      }
    } else {
      res.send(data);
    }
  });
}

export function remove(req, res) {
  if(!req.params.id) 
    res.status(400).send({ message: "Id can not be empty!" });
  Stack.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .send({ message: `Not found stack with id ${req.params.id}.` });
      } else {
        return res.status(500).send({
          message: "Could not delete stack with id " + req.params.id,
        });
      }
    }
    if(data){
      return res.send({ message: `Stack was deleted successfully!` });
    } 
  });
}
