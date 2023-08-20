import Animation from "../models/animationModel.js";

export function getAll(req, res) {
  const search = req.query.search ? req.query.search : false;
  const page = req.query.page ? req.query.page : 1;
  const ids = req.query.category_ids;
  const category_ids = [];
  if (ids) {
    ids.split(",").forEach((id) => {
      category_ids.push(parseInt(id));
    });
  }

  

  Animation.getAll(search, page, category_ids, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving animation.",
      });
    } else {
      res.send(data);
    }
  });
}

export function getById(req, res) {
  Animation.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Not found animation with id ${req.params.id}.` });
      } else {
        res.status(500).send({
          message: "Error retrieving animation with id " + req.params.id,
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

  const newAnimation = new Animation({
    page_url: req.body.page_url,
    good_review_count: req.body.good_review_count,
    medium_review_count: req.body.medium_review_count,
    bad_review_count: req.body.bad_review_count,
    view_count: req.body.view_count,
    featured: req.body.featured,
    title: req.body.title,
    title_pt: req.body.title_pt,
    preview_path: req.body.preview_path,
  });

  Animation.create(newAnimation, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the animation.",
      });
    } else {
      res.send(data);
    }
  });
}

export function getAllFeatured(req, res) {
  Animation.getAllFeatured((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving animation.",
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

  Animation.updateById(req.params.id, new Animation(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Not found animation with id ${req.params.id}.` });
      } else {
        res.status(500).send({
          message: "Error updating animation with id " + req.params.id,
        });
      }
    } else {
      res.send(data);
    }
  });
}

export function remove(req, res) {
  Animation.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Not found animation with id ${req.params.id}.` });
      } else {
        res.status(500).send({
          message: "Could not delete animation with id " + req.params.id,
        });
      }
    } else {
      res.send({ message: `Animation was deleted successfully!` });
    }
  });
}

export function addGoodReview(req, res) {
  Animation.addGoodReview(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found animation with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating animation with id " + req.params.id,
        });
      }
    } else {
      res.send(data);
    }
  });
}

export function addMediumReview(req, res) {
  Animation.addMediumReview(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found animation with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating animation with id " + req.params.id,
        });
      }
    } else {
      res.send(data);
    }
  });
}

export function addBadReview(req, res) {
  Animation.addBadReview(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found animation with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating animation with id " + req.params.id,
        });
      }
    } else {
      res.send(data);
    }
  });
}

export function addView(req, res) {
  Animation.addView(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found animation with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating animation with id " + req.params.id,
        });
      }
    } else {
      res.send(data);
    }
  });
}

export function addCategory(req, res) {
  Animation.addCategory(req.params.id, req.body.id_category, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found animation with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating animation with id " + req.params.id,
        });
      }
    } else {
      res.send(data);
    }
  });
}

export function removeCategory(req, res) {
  Animation.removeCategory(req.params.id, req.body.id_category, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found animation with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating animation with id " + req.params.id,
        });
      }
    } else {
      res.send(data);
    }
  });
}
