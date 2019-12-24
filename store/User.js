const { Pool } = require('pg')
const pool = new Pool()

const getUser = async (id) => {
	await pool.connect()

	let res = await pool.query('SELECT * FROM users where id=$1', [id])

	return res.rows[0]
}

const addUser = async (name, email, isNotified) => {
	await pool.connect()

	let res = await pool.query('INSERT INTO users (name, email, "isNotified", "createdAt") VALUES ($1, $2, $3, NOW()) RETURNING *', [name, email, isNotified])
	
	return res.rows[0]
} 

async function updateUser(id, name=null, email=null, isNotified=null) {
	await pool.connect()

	// fancy data mangling to construct a postgres query that
	// binds different numbers of arguments correctly
	const fields = [], args = []
	if (name) { fields.push("name"); args.push(name) }
	if (email) { fields.push("email"); args.push(email) }
	if (isNotified !== null) { fields.push("isNotified"); args.push(isNotified) }

	const subq = fields.map((field, i) => `${field}=$${i+2}, `).join('').replace('isNotified', '"isNotified"')
	const query = `UPDATE users SET 
		${subq} 
		"updatedAt"=NOW() WHERE id=$1 RETURNING *`
	
	let res = await pool.query(query, [id, ...args])

	return res.rows[0]
}

module.exports = {
	getUser,
	addUser,
	updateUser,
}