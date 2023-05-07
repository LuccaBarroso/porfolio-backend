import db from "./database.js";

const Project = function (project) {
  this.title = project.title;
  this.title_pt = project.title_pt;
  this.content = project.content;
  this.content_pt = project.content_pt;
  this.link_demo = project.link_demo;
  this.link_code = project.link_code;
  this.image = project.image;
  this.featured = project.featured;
};

Project.getAll = (result) => {
  db.query(
    `SELECT p.*, GROUP_CONCAT(s.name) as stack_names, GROUP_CONCAT(s.name_pt) as stack_names_pt, GROUP_CONCAT(s.image) as stack_images, GROUP_CONCAT(s.id_stack) as stack_ids
        FROM project p
        LEFT JOIN project_stack ps ON p.id_project = ps.id_project
        LEFT JOIN stack s ON ps.id_stack = s.id_stack
        GROUP BY p.id_project`,
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      result(null, res);
    }
  );
};

Project.getById = (projectId, result) => {
  db.query(
    `SELECT p.*, GROUP_CONCAT(s.name) as stack_names, GROUP_CONCAT(s.name_pt) as stack_names_pt, GROUP_CONCAT(s.image) as stack_images, GROUP_CONCAT(s.id_stack) as stack_ids
        FROM project p
        LEFT JOIN project_stack ps ON p.id_project = ps.id_project
        LEFT JOIN stack s ON ps.id_stack = s.id_stack
        WHERE p.id_project = ?
        GROUP BY p.id_project
    `,
    [projectId],
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

Project.create = (newProject, result) => {
  db.query(`INSERT INTO project SET ?`, newProject, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, { id: res.insertId, ...newProject });
  });
};

Project.updateById = (projectId, project, result) => {
  db.query(
    `UPDATE project SET title = ?, title_pt = ?, content = ?, content_pt = ?, link_demo = ?, link_code = ?, image = ?, featured = ? WHERE id_project = ?`,
    [
      project.title,
      project.title_pt,
      project.content,
      project.content_pt,
      project.link_demo,
      project.link_code,
      project.image,
      project.featured,
      projectId,
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

      result(null, { id: projectId, ...project });
    }
  );
};

Project.remove = (projectId, result) => {
  db.query(
    `DELETE FROM project_stack WHERE id_project = ?`,
    projectId,
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      db.query(
        `DELETE FROM project WHERE id_project = ?`,
        projectId,
        (err, res) => {
          if (err) {
            result(null, err);
            return;
          }

          if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
          }

          result(null, res);
        }
      );
    }
  );
};

Project.addStack = (projectId, stackId, result) => {
  // if i hasn't been added yet

  db.query(
    `SELECT * FROM project_stack WHERE id_project = ? AND id_stack = ?`,
    [projectId, stackId],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.length > 0) {
        result({ kind: "already_added" }, null);
        return;
      }

      db.query(
        `INSERT INTO project_stack (id_project, id_stack) VALUES (?, ?)`,
        [projectId, stackId],
        (err, res) => {
          if (err) {
            result(null, err);
            return;
          }

          const response = {
            id_project: projectId,
            id_stack: stackId,
            affectedRows: res.affectedRows,
          };

          result(null, response);
        }
      );
    }
  );
};

Project.removeStack = (projectId, stackId, result) => {
  db.query(
    `DELETE FROM project_stack WHERE id_project = ? AND id_stack = ?`,
    [projectId, stackId],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      const response = {
        id_project: projectId,
        id_stack: stackId,
        affectedRows: res.affectedRows,
      };

      result(null, response);
    }
  );
};

export default Project;
