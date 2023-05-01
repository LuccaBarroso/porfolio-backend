import Skill from "../models/skillModel.js";

export function getAll(req, res) {
  Skill.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving skills.",
      });
    else res.send(data);
  });
}

export function getById(req, res) {
  Skill.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found skill with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving skill with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
}

export function create(req, res) {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  const newSkill = new Skill({
    title: req.body.title,
    title_pt: req.body.title_pt,
  });

  Skill.create(newSkill, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the skill.",
      });
    else res.send(data);
  });
}

export function update(req, res) {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  Skill.updateById(req.params.id, new Skill(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Not found skill with id ${req.params.id}.` });
      } else {
        res.status(500).send({
          message: "Error updating skill with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
}

export function remove(req, res) {
  Skill.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Not found skill with id ${req.params.id}.` });
      } else {
        res.status(500).send({
          message: "Could not delete skill with id " + req.params.id,
        });
      }
    } else res.send({ message: `Skill was deleted successfully!` });
  });
}

export function addStack(req, res) {
  Skill.addStack(req.params.id, req.body.id_stack, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Skill not found with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating skill with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
}

export function removeStack(req, res) {
  if (!req.body.id_stack) {
    res.status(400).send({ message: "id_stack is requires in the body!" });
  }
  Skill.removeStack(req.params.id, req.body.id_stack, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Skill or Stack not found with id ${req.params.id} and ${req.body.id_stack}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating skill with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
}
