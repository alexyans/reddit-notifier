const store = require('../store')

const getUser = async (req, res) => {
	if (!req.params.id) {
		res.status(400).json({ message: 'Bad Request' })
		return
	}
	const id = req.params.id

	const user = await store.getUser(id)
	if (!user) {
		res.status(404).json({})
	}
	res.status(200).json(user)
}

const addUser = async (req, res) => {
	// get name param from req
	// if no name, return bad request
	if (!req.body || !req.body.name || !req.body.email) {
		res.status(400).json({ message: 'Bad Request' })
		return
	}
	let {name, email, isNotified} = req.body
	isNotified = isNotified !== false 
	
	// call data store func to create user
	const user = await store.addUser(name, email, isNotified)
	// construct response with created user in payload
	// return with 200
	res.status(200).json(user)
}

const updateUser = async (req, res) => {
	if (!req.params.id) {
		res.status(400).json({ message: 'Bad Request' })
		return
	}
	const id = req.params.id
	const {name, email, isNotified} = req.body

	const user = await store.updateUser(id, name, email, isNotified)
	res.status(200).json(user)
}

module.exports = {
    getUser,
    addUser,
    updateUser
}