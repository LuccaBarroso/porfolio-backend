import Post from "../models/postModel.js";

export function getAll(req, res) {
  Post.getAll(req.query.page, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving posts.",
      });
    else res.send(data);
  });
}

export function getById(req, res) {
  Post.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found post with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving post with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
}

export function create(req, res) {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  const newPost = new Post({
    title: req.body.title,
    title_pt: req.body.title_pt,
    image: req.body.image,
    preview_path: req.body.preview_path,
    excerpt: req.body.excerpt,
    excerpt_pt: req.body.excerpt_pt,
    post_date: req.body.post_date,
  });

  Post.create(newPost, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the post.",
      });
    else res.send(data);
  });
}

export function update(req, res) {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  Post.updateById(req.params.id, new Post(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Not found post with id ${req.params.id}.` });
      } else {
        res.status(500).send({
          message: "Error updating post with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
}

export function remove(req, res) {
  Post.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({ message: `Not found post with id ${req.params.id}.` });
      } else {
        res.status(500).send({
          message: "Could not delete post with id " + req.params.id,
        });
      }
    } else res.send({ message: `Post was deleted successfully!` });
  });
}
