import db from "./database.js";

const pageLimit = 10;

const Post = function (post) {
  this.title = post.title;
  this.title_pt = post.title_pt;
  this.image = post.image;
  this.preview_path = post.preview_path;
  this.excerpt = post.excerpt;
  this.excerpt_pt = post.excerpt_pt;
  this.post_date = post.post_date;
};

Post.getAll = (page = 1, result) => {
  let query = `SELECT COUNT(*) as total FROM post`;

  db.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    const totalPosts = res[0].total;
    const totalPages = Math.ceil(totalPosts / pageLimit);

    query =
      `SELECT * FROM post ORDER BY post_date DESC LIMIT ${pageLimit} OFFSET ` +
      (page - 1) * pageLimit;

    db.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      const response = {
        posts: res,
        totalPages,
        currentPage: page,
      };

      result(null, response);
    });
  });
};

Post.getById = (postId, result) => {
  db.query(`SELECT * FROM post WHERE id_post = ?`, [postId], (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.length == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res[0]);
  });
};

Post.create = (newPost, result) => {
  db.query(`INSERT INTO post SET ?`, newPost, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, { id: res.insertId, ...newPost });
  });
};

Post.updateById = (postId, post, result) => {
  db.query(
    `UPDATE post SET title = ?, title_pt = ?, image = ?, preview_path = ?, excerpt = ?, excerpt_pt = ?, post_date = ? WHERE id_post = ?`,
    [
      post.title,
      post.title_pt,
      post.image,
      post.preview_path,
      post.excerpt,
      post.excerpt_pt,
      post.post_date,
      postId,
    ],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: postId, ...post });
    }
  );
};

Post.remove = (postId, result) => {
  db.query(`DELETE FROM post WHERE id_post = ?`, postId, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

export default Post;
