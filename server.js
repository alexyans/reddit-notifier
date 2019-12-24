const express = require('express')
const handlers = require('./handlers')
const services = require('./services')

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(require('body-parser').json());
const port = process.env.NODE_ENV === 'test' ? 3001 : 3000

/* ROUTES */
// user routes
app.get('/users/:id', handlers.getUser)
app.patch('/users/:id', handlers.updateUser)
app.post('/users', handlers.addUser)

// subreddits routes
app.get('/users/:id/subreddits', handlers.getSubredditsByUserID)
app.post('/users/:id/subreddits', handlers.addSubredditByUserID)
app.patch('/users/:userId/subreddits/:subId', handlers.updateSubredditByID)

// send email
app.post('/send_emails', services.sendEmails)
app.get('/generate', services.generateSummaries)
/* END ROUTES */

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
