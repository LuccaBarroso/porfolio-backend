import Project from "../models/projectModel.js";

export function getAll(req, res) {
  Project.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving projects.",
      });
    else res.send(data);
  });
}

export function getById(req, res) {
  Project.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        if(!req.params.id) res.status(400).send({ message: "id is required in the params!" });
        res.status(404).send({
          message: `Not found project with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving project with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
}

export function create(req, res) {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  const newProject = new Project({
    title: req.body.title,
    title_pt: req.body.title_pt,
    content: req.body.content,
    content_pt: req.body.content_pt,
    link_demo: req.body.link_demo,
    link_code: req.body.link_code,
    image: req.body.image,
    featured: req.body.featured,
  });

  Project.create(newProject, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the project.",
      });
    else res.send(data);
  });
}

export function update(req, res) {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }
  const newProject = new Project({
    title: req.body.title,
    title_pt: req.body.title_pt,
    content: req.body.content,
    content_pt: req.body.content_pt,
    link_demo: req.body.link_demo,
    link_code: req.body.link_code,
    image: req.body.image,
    featured: req.body.featured,
  });

  Project.updateById(req.params.id, newProject, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Not found project with id ${req.params.id}.` });
      } else {
        res.status(500).send({
          message: "Error updating project with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
}

export function remove(req, res) {
  Project.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Not found project with id ${req.params.id}.` });
      } else {
        res.status(500).send({
          message: "Could not delete project with id " + req.params.id,
        });
      }
    } else res.send({ message: `project was deleted successfully!` });
  });
}

export function addStack(req, res) {
  if (!req.body.id_stack) {
    res.status(400).send({ message: "id_stack is requires in the body!" });
  }
  Project.addStack(req.params.id, req.body.id_stack, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found project with id ${req.params.id}.`,
        });
      } else if (err.kind === "already_added") {
        res.status(400).send({
          message: `Stack with id ${req.body.id_stack} already added to project with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error adding stack to project with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
}

export function removeStack(req, res) {
  if (!req.body.id_stack) {
    res.status(400).send({ message: "id_stack is requires in the body!" });
  }
  Project.removeStack(req.params.id, req.body.id_stack, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found project with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error removing stack to project with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
}
