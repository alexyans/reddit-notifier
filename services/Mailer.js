const mail = require('@sendgrid/mail')
const handlebars = require('handlebars')
const fs = require('fs')
const store = require('../store')
const reddit = require('./RedditCrawler')

mail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmails = async (req, res) => {
    const summaries = await reddit.generateSummaries()
    const usersSubreddits = await store.getAllUsersSubreddits()

    const idsToSubreddits = transformToMap(usersSubreddits)

    // at this point i have all summaries by r/prefix
    // and all urls by user 

    Object.keys(idsToSubreddits).forEach(async (id) => {
        const user = idsToSubreddits[id]
        if (!user.isNotified || !user.email) return

        const templateVars = constructTemplateVars(user, summaries)
        console.log(templateVars)
        const msg = await constructMessage(user, templateVars)

        mail.send(msg)
        console.log(`Email sent to ${user.email}.`)
    })

    res.status(200).json({ message: "Emails sent successfully." })
}

const constructTemplateVars = (user, summaries) => {
    const name = user.name
    const userSummaries = user.subreddits.map((prefix) => {
        return { [prefix] : summaries[prefix] }
    })

    return {
        name,
        userSummaries
    }
}

const constructMessage = async (user, templateVars) => {
    const to = user.email
    const from = "redditnotifier@example.com"
    const subject = "Your daily digest"

    const [text, html] = await Promise.all([
        willCompileTemplate('templates/email.txt', templateVars),
        willCompileTemplate('templates/email.html', templateVars)
    ])

    return { to, from, subject, text, html }
}

const willCompileTemplate = (path, vars) => 
    new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, source) => {
            const template = handlebars.compile(source)
            out = template(vars)
            resolve(out)
        })
    })

const transformToMap = (rows) => {
    let idsToSubreddits = {}
    rows.forEach((row) => {
        const id = row.id

        if (!idsToSubreddits[id]) {
            idsToSubreddits[id] = {
                name: row.name,
                email: row.email,
                isNotified: row.isNotified,
                subreddits: []
            }
        }
        // change to set
        const prefix = row.url.match(/.*reddit.com\/(r\/.*)\/?.*/)[1]
        idsToSubreddits[id].subreddits.push(prefix)
    })

    return idsToSubreddits
}

module.exports = {
    sendEmails
}