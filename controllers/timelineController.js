import Timeline from "../models/timelineModel.js";

export function getAll(req, res) {
  Timeline.getAll(req.query.page, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving timelines.",
      });
    else res.send(data);
  });
}

export function getById(req, res) {
  Timeline.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found timeline with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving timeline with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
}

export function create(req, res) {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  const newTimeline = new Timeline({
    timeline_date: req.body.timeline_date,
    title: req.body.title,
    title_pt: req.body.title_pt,
    content: req.body.content,
    content_pt: req.body.content_pt,
  });

  Timeline.create(newTimeline, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the timeline.",
      });
    else res.send(data);
  });
}

export function update(req, res) {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  Timeline.updateById(req.params.id, new Timeline(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found timeline with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating timeline with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
}

export function remove(req, res) {
  Timeline.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found timeline with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete timeline with id " + req.params.id,
        });
      }
    } else res.send({ message: `timeline was deleted successfully!` });
  });
}
