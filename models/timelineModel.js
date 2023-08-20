import db from "./database.js";


const Timeline = function (post) {
  this.timeline_date = post.timeline_date;
  this.title = post.title;
  this.title_pt = post.title_pt;
  this.content = post.content;
  this.content_pt = post.content_pt;
};

const pageLimit = 4;

Timeline.getAll = (page = 1, result) => {
  let query = `SELECT COUNT(*) as total FROM timeline`;

  db.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    const totalPosts = res[0].total;
    const totalPages = Math.ceil(totalPosts / pageLimit);

    query = `SELECT * FROM timeline ORDER BY timeline_date ASC LIMIT ${pageLimit} OFFSET ` + (page - 1) * pageLimit;

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

Timeline.getById = (postId, result) => {
  db.query(
    `SELECT * FROM timeline WHERE id_timeline = ?`,
    [postId],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.length == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, res[0]);
    }
  );
};

Timeline.create = (newPost, result) => {
  db.query("INSERT INTO timeline SET ?", newPost, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, { id: res.insertId, ...newPost });
  });
};

Timeline.updateById = (id, post, result) => {
  db.query(
    "UPDATE timeline SET timeline_date = ?, title = ?, title_pt = ?, content = ?, content_pt = ? WHERE id_timeline = ?",
    [
      post.timeline_date,
      post.title,
      post.title_pt,
      post.content,
      post.content_pt,
      id,
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

      result(null, { id: id, ...post });
    }
  );
};

Timeline.remove = (id, result) => {
  db.query("DELETE FROM timeline WHERE id_timeline = ?", id, (err, res) => {
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

export default Timeline;
