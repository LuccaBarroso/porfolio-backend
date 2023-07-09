import db from "./database.js";

const Stack = function (stack) {
  this.name = stack.name;
  this.name_pt = stack.name_pt;
  this.image = stack.image;
  this.can_project = stack.can_project;
};

Stack.getAll = (callback) => {
  db.query(`SELECT * FROM stack`, (err, res) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, res);
    }    
  });
};

Stack.getById = (stackId, callback) => {
  db.query(`SELECT * FROM stack WHERE id_stack = ?`, [stackId], (err, res) => {
    if (err) {
      callback(err, null);
    } else if (res.length === 0) {
      callback({ kind: "not_found" }, null);
    } else {
      callback(null, res[0]);
    }    
  });
};

Stack.create = (newStack, callback) => {
  db.query(`INSERT INTO stack SET ?`, newStack, (err, res) => {
    if (err) {
      callback(err, null);
    } else {
      const response = { id: res.insertId, ...newStack };
      callback(null, response);
    }    
  });
};

Stack.updateById = (stackId, stack, callback) => {
  db.query(
    `UPDATE stack SET name = ?, name_pt = ?, image = ?, can_project = ? WHERE id_stack = ?`,
    [stack.name, stack.name_pt, stack.image, stack.can_project, stackId],
    (err, res) => {
      if (err) {
        callback(err, null);
      } else if (res.affectedRows === 0) {
        callback({ kind: "not_found" }, null);
      } else {
        const response = { id: stackId, ...stack };
        callback(null, response);
      }      
    }
  );
};

Stack.remove = (stackId, callback) => {
  db.query(`DELETE FROM stack_skill WHERE id_stack = ?`, stackId, (err, res) => {
    
    if (err) {
      callback(err, null);
    } else {
      db.query(`DELETE FROM project_stack WHERE id_stack = ?`, stackId, (err, res) => {
        if (err) {
          callback(err, null);
        } else {
          db.query(`DELETE FROM stack WHERE id_stack = ?`, stackId, (err, res) => {
            if (err) {
              callback(err, null);
            } else if (res.affectedRows === 0) {
              callback({ kind: "not_found" }, null);
            } else {
              callback(null, res);
            }
          });
        }
      });
    }
  });
};

export default Stack;
