import db from "./database.js";

const pageLimit = 10;
const limitFeatured = 2;

// Model
const Animation = function (animation) {
  this.page_url = animation.page_url;
  this.good_review_count = animation.good_review_count;
  this.medium_review_count = animation.medium_review_count;
  this.bad_review_count = animation.bad_review_count;
  this.view_count = animation.view_count;
  this.featured = animation.featured;
  this.title = animation.title;
  this.title_pt = animation.title_pt;
  this.preview_path = animation.preview_path;
};

// Animation.getAll = (
//   searchQuery = false,
//   page = 1,
//   category_ids = [],
//   callback
// ) => {
//   let query = `SELECT a.*,
//   SUM(view_count + good_review_count + medium_review_count) AS total_count,
//   GROUP_CONCAT(ac.title) AS cat_title,
//   GROUP_CONCAT(ac.id_animation_category) AS cat_id,
//   GROUP_CONCAT(ac.title_pt) AS cat_title_pt
//    FROM animation a
//     LEFT JOIN animation_animation_category aac ON a.id_animation = aac.id_animation
//     LEFT JOIN animation_category ac ON aac.id_animation_category = ac.id_animation_category `;

//   if (searchQuery) {
//     query += " WHERE a.title LIKE '%" + searchQuery + "%'";
//   }

//   query += " GROUP BY a.id_animation";

//   if (category_ids.length > 0) {
//     query +=
//       " HAVING COUNT(CASE WHEN ac.id_animation_category IN (" +
//       category_ids.join(",") +
//       ") THEN 1 END) = " +
//       category_ids.length;
//   }

//   query += " ORDER BY total_count DESC";
//   query += " LIMIT " + pageLimit + " OFFSET " + (page - 1) * pageLimit;

//   db.query(query, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       callback(null, err);
//       return;
//     }

//     callback(null, res);
//   });
// };

Animation.getAll = (
  searchQuery = false,
  page = 1,
  category_ids = [],
  callback
) => {
  let query = `SELECT a.*,
    SUM(view_count + good_review_count + medium_review_count) AS total_count,
    GROUP_CONCAT(ac.title) AS cat_title,
    GROUP_CONCAT(ac.id_animation_category) AS cat_id,
    GROUP_CONCAT(ac.title_pt) AS cat_title_pt
    FROM animation a
    LEFT JOIN animation_animation_category aac ON a.id_animation = aac.id_animation
    LEFT JOIN animation_category ac ON aac.id_animation_category = ac.id_animation_category`;

  if (searchQuery) {
    query += " WHERE a.title LIKE '%" + searchQuery + "%'";
  }

  query += " GROUP BY a.id_animation";

  if (category_ids.length > 0) {
    query +=
      " HAVING COUNT(CASE WHEN ac.id_animation_category IN (" +
      category_ids.join(",") +
      ") THEN 1 END) = " +
      category_ids.length;
  }

  query += " ORDER BY total_count DESC";
  query += " LIMIT " + pageLimit + " OFFSET " + (page - 1) * pageLimit;

  db.query(query, (err, animations) => {
    if (err) {
      console.log("error: ", err);
      callback(null, err);
      return;
    }

    let countQuery = `SELECT COUNT(DISTINCT a.id_animation) as count
      FROM animation a
      LEFT JOIN animation_animation_category aac ON a.id_animation = aac.id_animation
      LEFT JOIN animation_category ac ON aac.id_animation_category = ac.id_animation_category`;

    if (searchQuery) {
      countQuery += " WHERE a.title LIKE '%" + searchQuery + "%'";
    }

    if (category_ids.length > 0) {
      countQuery +=
        " WHERE ac.id_animation_category IN (" + category_ids.join(",") + ")";
    }

    db.query(countQuery, (err, countResult) => {
      if (err) {
        console.log("error: ", err);
        callback(null, err);
        return;
      }

      const totalCount = countResult[0].count;
      const totalPages = Math.ceil(totalCount / pageLimit);
      const currentPage = page;

      callback(null, { animations, totalPages, currentPage });
    });
  });
};

Animation.getById = (animationId, callback) => {
  db.query(
    `SELECT a.*, GROUP_CONCAT(ac.title) AS cat_title,  GROUP_CONCAT(ac.id_animation_category) AS cat_id, GROUP_CONCAT(ac.title_pt) AS cat_title_pt
    FROM animation a
    LEFT JOIN animation_animation_category aac ON a.id_animation = aac.id_animation
    LEFT JOIN animation_category ac ON aac.id_animation_category = ac.id_animation_category
    WHERE a.id_animation = ? GROUP BY a.id_animation;`,
    [animationId],
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

Animation.create = (newAnimation, callback) => {
  db.query("INSERT INTO animation SET ?", newAnimation, (err, res) => {
    if (err) {
      callback(null, err);
      return;
    }

    callback(null, { id: res.insertId, ...newAnimation });
  });
};

Animation.getAllFeatured = (callback) => {
  db.query(
    `SELECT * FROM animation WHERE featured = 1 ORDER BY RAND() LIMIT ${limitFeatured}`,
    (err, res) => {
      if (err) {
        callback(null, err);
        return;
      }

      callback(null, res);
    }
  );
};

Animation.updateById = (id, animation, callback) => {
  db.query(
    "UPDATE animation SET page_url = ?, good_review_count = ?, medium_review_count = ?, bad_review_count = ?, view_count = ?, featured = ?, title = ?, title_pt = ?, preview_path = ? WHERE id_animation = ?",
    [
      animation.page_url,
      animation.good_review_count,
      animation.medium_review_count,
      animation.bad_review_count,
      animation.view_count,
      animation.featured,
      animation.title,
      animation.title_pt,
      animation.preview_path,
      id,
    ],
    (err, res) => {
      if (err) {
        callback(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        callback({ kind: "not_found" }, null);
        return;
      }

      callback(null, { id: id, ...animation });
      return;
    }
  );
};

Animation.remove = (id, callback) => {
  Animation.deleteRelatedCategories(id, (err, res) => {
    if (err) {
      callback(null, err);
      return;
    }
    db.query("DELETE FROM animation WHERE id_animation = ?", [id], (err, res) => {
      if (err) {
        callback(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        callback({ kind: "not_found" }, null);
        return;
      }
      callback(null, res);
    });
  });
};

Animation.deleteRelatedCategories = (id, callback) => {
  // delete all animation_animation_category
  db.query(
    "DELETE FROM animation_animation_category WHERE id_animation = ?",
    [id],
    (err, res) => {
      if (err) {
        callback(null, err);
        return;
      }
      callback(null, res);
    }
  );
};


Animation.addGoodReview = (id, callback) => {
  db.query(
    "UPDATE animation SET good_review_count = good_review_count + 1 WHERE id_animation = ?",
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
      return;
    }
  );
};

Animation.addMediumReview = (id, callback) => {
  db.query(
    "UPDATE animation SET medium_review_count = medium_review_count + 1 WHERE id_animation = ?",
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
      return;
    }
  );
};

Animation.addBadReview = (id, callback) => {
  db.query(
    "UPDATE animation SET bad_review_count = bad_review_count + 1 WHERE id_animation = ?",
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
      return;
    }
  );
};

Animation.addView = (id, callback) => {
  db.query(
    "UPDATE animation SET view_count = view_count + 1 WHERE id_animation = ?",
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
      return;
    }
  );
};

Animation.addCategory = (id, category_id, callback) => {
  if (category_id == null) {
    callback(null, { message: "category_id is null" });
    return;
  }

  // only add if it doesnt alredy have it
  db.query(
    "SELECT * FROM animation_animation_category WHERE id_animation = ? AND id_animation_category = ?",
    [id, category_id],
    (err, res) => {
      if (err) {
        callback(null, err);
        return;
      }

      if (res.length) {
        callback(null, { message: "already has category" });
        return;
      } else {
        db.query(
          "INSERT INTO animation_animation_category (id_animation, id_animation_category) VALUES (?, ?)",
          [id, category_id],
          (err, res) => {
            if (err) {
              callback(null, err);
              return;
            }

            callback(null, res);
            return;
          }
        );
      }
    }
  );
};

Animation.removeCategory = (id, category_id, callback) => {
  db.query(
    "DELETE FROM animation_animation_category WHERE id_animation = ? AND id_animation_category = ?",
    [id, category_id],
    (err, res) => {
      if (err) {
        callback(null, err);
        return;
      }

      callback(null, res);
      return;
    }
  );
};

export default Animation;
