import AnimationCategory from "../models/animationCategoryModel.js";

export function getAll(req, res) {
  AnimationCategory.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving animation categories.",
      });
    } else {
      res.send(data);
    }
  });
}

export function getById(req, res) {
  AnimationCategory.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found animation category with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving animation category with id " + req.params.id,
        });
      }
    } else {
      res.send(data);
    }
  });
}

export function create(req, res) {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  const animationCategory = new AnimationCategory({
    title: req.body.title,
    title_pt: req.body.title_pt,
  });

  AnimationCategory.create(animationCategory, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the animation category.",
      });
    } else {
      res.send(data);
    }
  });
}

export function update(req, res) {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  AnimationCategory.updateById(
    req.params.id,
    new AnimationCategory(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found animation category with id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message:
              "Error updating animation category with id " + req.params.id,
          });
        }
      } else {
        res.send(data);
      }
    }
  );
}

export function remove(req, res) {
  AnimationCategory.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found animation category with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving animation category with id " + req.params.id,
        });
      }
    } else {
      res.send({ message: `Animation category was deleted successfully!` });
    }
  });
}
