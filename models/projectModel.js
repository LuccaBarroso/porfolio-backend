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
        GROUP BY p.id_project 
        ORDER BY p.featured DESC
        `,
    (err, res) => {
      if (err) {
        result(err, null);
      } else {
        let projects = [];
        res.forEach((project) => {
          projects.push({
            id_project: project.id_project,
            title: project.title,
            title_pt: project.title_pt,
            content: project.content,
            content_pt: project.content_pt,
            link_demo: project.link_demo,
            link_code: project.link_code,
            image: project.image,
            featured: project.featured,
            stacks: [],
          });
          if (project.stack_names) {
            const stackNames = project.stack_names.split(",");
            const stackNamesPt = project.stack_names_pt.split(",");
            const stackImages = project.stack_images.split(",");
            const stackIds = project.stack_ids.split(",");
            stackNames.forEach((stackName, index) => {
              projects[projects.length - 1].stacks.push({
                id_stack: stackIds[index],
                name: stackName,
                name_pt: stackNamesPt[index],
                image: stackImages[index],
              });
            });
          }
        });
          
        result(null, projects);
      }
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
      if (err || res.length === 0) {
        const error = err ? err : { kind: "not_found" };
        result(error, null);
      } else {
        result(null, res[0]);
      }      
    }
  );
};

Project.create = (newProject, result) => {
  db.query(`INSERT INTO project SET ?`, newProject, (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, { id: res.insertId, ...newProject });
    }
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
      if (err || res.affectedRows === 0) {
        const error = err ? err : { kind: "not_found" };
        result(error, null);
      } else {
        result(null, { id: projectId, ...project });
      }      
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
      }else{
        db.query(
          `DELETE FROM project WHERE id_project = ?`,
          projectId,
          (err, res) => {
            if (err || res.affectedRows === 0) {
              const error = err ? err : { kind: "not_found" };
              result(error, null);
            } else {
              result(null, res);
            }            
          }
        );
      }

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
        result(err, null);
      } else if (res.length > 0) {
        result({ kind: "already_added" }, null);
      } else {
        db.query(
          `INSERT INTO project_stack (id_project, id_stack) VALUES (?, ?)`,
          [projectId, stackId],
          (err, res) => {
            if (err) {
              result(err, null);
            } else {
              const response = {
                id_project: projectId,
                id_stack: stackId,
                affectedRows: res.affectedRows,
              };
              result(null, response);
            }
          }
        );
      }      
    }
  );
};

Project.removeStack = (projectId, stackId, result) => {
  db.query(
    `DELETE FROM project_stack WHERE id_project = ? AND id_stack = ?`,
    [projectId, stackId],
    (err, res) => {
      if (err || res.affectedRows === 0) {
        const error = err ? err : { kind: "not_found" };
        result(error, null);
      } else {
        const response = {
          id_project: projectId,
          id_stack: stackId,
          affectedRows: res.affectedRows,
        };
        result(null, response);
      }      
    }
  );
};

export default Project;
