const mailer = require('./Mailer')
const crawler = require('./RedditCrawler')

module.exports = Object.assign({}, mailer, crawler)