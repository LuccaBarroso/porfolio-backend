import db from "./database.js";

const Skill = function (skill) {
  this.title = skill.title;
  this.title_pt = skill.title_pt;
};

Skill.getAll = (result) => {
  db.query(
    `SELECT s.*, GROUP_CONCAT(st.name) as stack_names, GROUP_CONCAT(st.name_pt) as stack_names_pt, GROUP_CONCAT(st.image) as stack_images, GROUP_CONCAT(st.id_stack) as stack_ids
       FROM skill s 
       LEFT JOIN stack_skill ss ON s.id_skill = ss.id_skill 
       LEFT JOIN stack st ON ss.id_stack = st.id_stack 
       GROUP BY s.id_skill`,
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      let treatedSkills = [];
      res.forEach((skill) => {
        treatedSkills.push({
          id_skill: skill.id_skill,
          title: skill.title,
          title_pt: skill.title_pt,
          stacks: [],
        });
        if (skill.stack_names) {
          const stackNames = skill.stack_names.split(",");
          const stackNamesPt = skill.stack_names_pt.split(",");
          const stackImages = skill.stack_images.split(",");
          const stackIds = skill.stack_ids.split(",");
          stackNames.forEach((stackName, index) => {
            treatedSkills[treatedSkills.length - 1].stacks.push({
              id_stack: stackIds[index],
              name: stackName,
              name_pt: stackNamesPt[index],
              image: stackImages[index],
            });
          });
        }
      });
      result(null, treatedSkills);
      return;
    }
  );
};

Skill.getById = (skillId, result) => {
  db.query(
    `SELECT s.*, GROUP_CONCAT(st.name) as stack_names, GROUP_CONCAT(st.name_pt) as stack_names_pt, GROUP_CONCAT(st.image) as stack_images, GROUP_CONCAT(st.id_stack) as stack_ids  
       FROM skill s 
       LEFT JOIN stack_skill ss ON s.id_skill = ss.id_skill 
       LEFT JOIN stack st ON ss.id_stack = st.id_stack 
       WHERE s.id_skill = ?
       GROUP BY s.id_skill`,
    [skillId],
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
      return;
    }
  );
};

Skill.create = (newSkill, result) => {
  db.query(`INSERT INTO skill SET ?`, newSkill, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    
    result(null, { id: res.insertId, ...newSkill });
    return;
  });
};

Skill.updateById = (skillId, skill, result) => {
  db.query(
    `UPDATE skill SET title = ?, title_pt = ? WHERE id_skill = ?`,
    [skill.title, skill.title_pt, skillId],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      
      result(null, { id: skillId, ...skill });
      return;
    }
  );
};

Skill.remove = (skillId, result) => {
  // remove all stack_skill entries with this skill
  db.query(
    `DELETE FROM stack_skill WHERE id_skill = ?`,
    skillId,
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      db.query(`DELETE FROM skill WHERE id_skill = ?`, skillId, (err, res) => {
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
    }
  );

};

Skill.addStack = (skillId, stackId, result) => {
  // if doesn't already have this stack

  db.query(
    `SELECT * FROM stack_skill WHERE id_skill = ? AND id_stack = ?`,
    [skillId, stackId],
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
        `INSERT INTO stack_skill (id_skill, id_stack) VALUES (?, ?)`,
        [skillId, stackId],
        (err, res) => {
          if (err) {
            result(null, err);
            return;
          }
          
          result(null, res);
          return;
        }
      );
    }
  );
};

Skill.removeStack = (skillId, stackId, result) => {
  db.query(
    `DELETE FROM stack_skill WHERE id_skill = ? AND id_stack = ?`,
    [skillId, stackId],
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
      return;
    }
  );
};

export default Skill;