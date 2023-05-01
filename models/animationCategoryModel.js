import db from "./database.js";

// Model
const AnimationCategory = function (animationCategory) {
  this.title = animationCategory.title;
  this.title_pt = animationCategory.title_pt;
};

AnimationCategory.getAll = (callback) => {
  db.query("SELECT * FROM animation_category", (err, res) => {
    if (err) {
      callback(null, err);
      return;
    }

    callback(null, res);
  });
};

AnimationCategory.getById = (animationCategoryId, callback) => {
  db.query(
    `SELECT * FROM animation_category WHERE id_animation_category = ?`,
    [animationCategoryId],
    (err, res) => {
      if (err) {
        callback(null, err);
        return;
      }

      if (res.length) {
        callback(null, res[0]);
        return;
      } else {
        callback({ kind: "not_found" }, null);
        return;
      }
    }
  );
};

AnimationCategory.create = (newAnimationCategory, callback) => {
  db.query(
    "INSERT INTO animation_category SET ?",
    newAnimationCategory,
    (err, res) => {
      if (err) {
        callback(null, err);
        return;
      }

      callback(null, { id: res.insertId, ...newAnimationCategory });
    }
  );
};

AnimationCategory.updateById = (id, animationCategory, callback) => {
  db.query(
    "UPDATE animation_category SET title = ?, title_pt = ? WHERE id_animation_category = ?",
    [animationCategory.title, animationCategory.title_pt, id],
    (err, res) => {
      if (err) {
        callback(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        callback({ kind: "not_found" }, null);
        return;
      }

      callback(null, { id: id, ...animationCategory });
    }
  );
};

AnimationCategory.remove = (id, callback) => {
  db.query(
    "DELETE FROM animation_category WHERE id_animation_category = ?",
    [id],
    (err, res) => {
      if (err) {
        callback(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        callback({ kind: "not_found" }, null);
        return;
      }

      callback(null, res);
    }
  );
};

export default AnimationCategory;
