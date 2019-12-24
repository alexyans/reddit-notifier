const store = require('../store')

const getSubredditsByUserID = async (req, res) => {
	if (!req.params.id) {
		res.status(400).json({ message: 'Bad Request' })
		return
	}
	const userId = req.params.id

	const subreddits = await store.getSubredditsByUserId(userId)
	res.status(200).json(subreddits)
}

const addSubredditByUserID = async (req, res) => {
	// get name param from req
	// if no name, return bad request
	if (!req.body || !req.body.url || !req.params.id) {
		res.status(400).json({ message: 'Bad Request' })
		return
	}
	const userId = req.params.id
	const url = req.body.url
	
	// call data store func to create user
	const subreddit = await store.addSubredditByUserID(userId, url)
	// construct response with created user in payload
	// return with 200
	res.status(200).json(subreddit)
}

// UserID would normally be used for authorization, but in this implementation it's not actually used
const updateSubredditByID = async (req, res) => {
	if (!req.body || !req.body.url || !req.params.userId || !req.params.subId) {
		res.status(400).json({ message: 'Bad Request' })
		return
	}
	const userId = req.params.userId
	const subId = req.params.subId
	const newUrl = req.body.url

	const subreddit = await store.updateSubredditByID(subId, newUrl)
	res.status(200).json(subreddit)
}

module.exports = {
    getSubredditsByUserID,
    addSubredditByUserID,
    updateSubredditByID
}