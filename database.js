import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

// const [rows] = await pool.query("SELECT * FROM animation");

export async function getAnimations() {
  const [rows] = await pool.query("SELECT * FROM animation");
  return rows;
}

export async function getAnimation(id) {
  const [rows] = await pool.query(
    "SELECT * FROM animation WHERE id_animation = ?",
    [id]
  );
  return rows[0];
}

export async function createAnimation({
  page_url,
  good_review_count,
  medium_review_count,
  bad_review_count,
  view_count,
  featured,
  title,
  title_pt,
  preview_path,
}) {
  const result = await pool.query(
    "INSERT INTO animation (page_url, good_review_count, medium_review_count, bad_review_count, view_count, featured, title, title_pt, preview_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      page_url,
      good_review_count,
      medium_review_count,
      bad_review_count,
      view_count,
      featured,
      title,
      title_pt,
      preview_path,
    ]
  );
  return result[0].insertId;
}
