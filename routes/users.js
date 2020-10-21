// /** Routes for users of pg-intro-demo. */

// const express = require("express");
// const ExpressError = require("../expressError")
// const router = express.Router();
// const db = require("../db");

// router.get('/', async (req, res, next) => {
//   try {
//     const results = await db.query(`SELECT * FROM users`);
//     return res.json({ users: results.rows })
//   } catch (e) {
//     return next(e);
//   }
// })
// router.get('/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const results = await db.query('SELECT * FROM users WHERE id = $1', [id])
//     if (results.rows.length === 0) {
//       throw new ExpressError(`Can't find user with id of ${id}`, 404)
//     }
//     return res.send({ user: results.rows[0] })
//   } catch (e) {
//     return next(e)
//   }
// })

// router.get('/search', async (req, res, next) => {
//   try {
//     const { type } = req.query;
//     const results = await db.query(`SELECT * FROM users WHERE type=$1`, [type])
//     return res.json(results.rows)
//   } catch (e) {
//     return next(e)
//   }
// })

// router.post('/', async (req, res, next) => {
//   try {
//     const { name, type } = req.body;
//     const results = await db.query('INSERT INTO users (name, type) VALUES ($1, $2) RETURNING id, name, type', [name, type]);
//     return res.status(201).json({ user: results.rows[0] })
//   } catch (e) {
//     return next(e)
//   }
// })

// router.patch('/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { name, type } = req.body;
//     const results = await db.query('UPDATE users SET name=$1, type=$2 WHERE id=$3 RETURNING id, name, type', [name, type, id])
//     if (results.rows.length === 0) {
//       throw new ExpressError(`Can't update user with id of ${id}`, 404)
//     }
//     return res.send({ user: results.rows[0] })
//   } catch (e) {
//     return next(e)
//   }
// })

// router.delete('/:id', async (req, res, next) => {
//   try {
//     const results = db.query('DELETE FROM users WHERE id = $1', [req.params.id])
//     return res.send({ msg: "DELETED!" })
//   } catch (e) {
//     return next(e)
//   }
// })


// module.exports = router;

const express = require("express");
const router = express.Router();
const db = require('../db');

//ALL QUERIES ARE ASYNC!

router.get('/', async(req, res, next) => {
  try {
    const results = await db.query( //the query method accepts pure SQL string
      `SELECT * FROM users`
    );
    return res.json(results.rows);
  } catch (error) {
    next(error);
  }
})

router.get('/search', async(req, res, next) => {
  try {
    const type = req.query.type; //type is a column in our users tables
    // const results = await db.query(`SELECT * FROM users WHERE type=$1'${type}'`); //you need to have qutoes around 'type' so it is read as a string and not a var
    const results = await db.query(`SELECT * FROM users WHERE type=$1`, [type]); //this one uses sanitized queries.

    return res.json(results.rows);
  } catch (error) {
    next(error);
  }
})

router.post('/', async(req, res, next) => {
  try {
    const {name, type} = req.body; //use object destructuring to isolate name and type properties from json body.
    const results = await db.query(`INSERT INTO users (name, type) VALUES($1, $2) RETURNING *`, [name, type]); //insert them into the table along with a RETURNING which spits out name and type data
    return res.status(201).json(results.rows); //pass along 201 (created) status
  } catch (error) {
    next(error);
  }
})

router.patch('/:id', async(req, res, next) => {
  try {
    const {name, type} = req.body;
    const results = await db.query(`UPDATE users SET name=$1, type=$2 WHERE id=$3 RETURNING *`, [name, type, req.params.id])//remember, id is stored in req.params
    return res.json(results.rows);
  } catch (error) {
    next(error);
  }
})

router.delete('/:id', async(req, res, next)=> {
  try {
    const results = await db.query(`DELETE FROM users WHERE id=$1 RETURNING 'User Deleted'`, [req.params.id]);
    return res.json(results.rows)
  } catch (error) {
    next(error);
  }
})

module.exports = router;
