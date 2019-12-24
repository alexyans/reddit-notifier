const { Pool } = require('pg')
const pool = new Pool()

const getSubredditsByUserId = async (userId) => {
	await pool.connect()

	let res = await pool.query('SELECT * FROM user_subreddits where user_id=$1', [userId])

	return res.rows
}

const getAllSubreddits = async () => {
    await pool.connect()

    let res = await pool.query('SELECT DISTINCT url FROM user_subreddits')

    return res.rows
}

const getAllUsersSubreddits = async () => {
    await pool.connect()

    let res = await pool.query(`
        SELECT u.id, u.name, u.email, u."isNotified", s.url FROM users AS u
        INNER JOIN user_subreddits AS s
        ON u.id = s.user_id
    `)

    return res.rows
}

const addSubredditByUserID = async (userId, url) => {
	await pool.connect()

	let res = await pool.query('INSERT INTO user_subreddits (user_id, url, "createdAt") VALUES ($1, $2, NOW()) RETURNING *', [userId, url])
	
	return res.rows[0]
}

const updateSubredditByID = async (id, url) => {
	await pool.connect()

	let res = await pool.query('UPDATE user_subreddits SET url=$2, "updatedAt"=NOW() WHERE id=$1 RETURNING *', [id, url])

	return res.rows[0]
}

module.exports = {
    getSubredditsByUserId,
    addSubredditByUserID,
    updateSubredditByID,
    getAllSubreddits,
    getAllUsersSubreddits
}