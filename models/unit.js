"use strict";

const db = require("../db");
const ExpressError = require("../expressError");

/** Methods for units. */

class Unit {
  /** Create a unit.
   *
   * data should be { subjectId, number, title, startDate, endDate, reviewDate }
   *
   * date format: yyyy-mm-dd (for startDate, endDate, reviewDate )
   *
   * Returns unit
   *
   * */

  static async create({
    subjectId,
    number,
    title,
    startDate,
    endDate,
    reviewDate,
  }) {
    const result = await db.query(
      `INSERT INTO units
           (subject_id, number, title, start_date, end_date, review_date)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING
            id,
            subject_id AS "subjectId",
            number,
            title,
            to_char(start_date, 'YYYY-MM-DD') AS "startDate",
            to_char(end_date, 'YYYY-MM-DD') AS "endDate",
            to_char(review_date, 'YYYY-MM-DD') AS "reviewDate",
            planning,
            collaboration,
            completed`,
      [subjectId, number, title, startDate, endDate, reviewDate]
    );
    const unit = result.rows[0];

    return unit;
  }

  /** Update a unit.
   *
   * data should be {startDate, endDate, reviewDate, completed, planning, collaboration}, id
   *
   * Returns unit
   *
   * */

  static async update(
    { startDate, endDate, reviewDate, completed, planning, collaboration },
    id
  ) {
    const result = await db.query(
      `UPDATE units
           SET start_date=$1, end_date=$2, review_date=$3, completed=$4, planning=$5, collaboration=$6
           WHERE id=$7
           RETURNING
            id,
            subject_id AS "subjectId",
            number,
            title,
            to_char(start_date, 'YYYY-MM-DD') AS "startDate",
            to_char(end_date, 'YYYY-MM-DD') AS "endDate",
            to_char(review_date, 'YYYY-MM-DD') AS "reviewDate",
            planning,
            collaboration,
            completed`,
      [startDate, endDate, reviewDate, completed, planning, collaboration, id]
    );
    const unit = result.rows[0];

    if (!unit) throw new ExpressError("Unit not found", 404);

    return unit;
  }

  /** Get a unit by id. Returns unit. */

  static async get(id) {
    const result = await db.query(
      `SELECT
          u.id,
          u.subject_id AS "subjectId",
          s.name AS "subjectName",
          s.set_id AS "setId",
          u.number,
          u.title,
          to_char(u.start_date, 'YYYY-MM-DD') AS "startDate",
          to_char(u.end_date, 'YYYY-MM-DD') AS "endDate",
          to_char(u.review_date, 'YYYY-MM-DD') AS "reviewDate",
          u.planning,
          u.collaboration,
          u.completed
      FROM
          units AS u
          JOIN subjects AS s ON u.subject_id = s.id
      WHERE
          u.id = $1`,
      [id]
    );
    const unit = result.rows[0];

    if (!unit) throw new ExpressError("Unit not found", 404);

    return unit;
  }
}

module.exports = Unit;
