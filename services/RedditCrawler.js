const request = require('request-promise-native');
const store = require('../store')

const generateSummaries = async () => {
    const subreddits = await store.getAllSubreddits()
    
    const subredditToSummaries = await buildSubredditToSummaries(subreddits)
    return subredditToSummaries
}

const buildSubredditToSummaries = async (subreddits) => {
    subreddits = await Promise.all(subreddits.map(async (sub) => {
        const r_prefix = sub.url.match(/.*reddit.com\/(r\/.*)\/?.*/)[1]
        const summary = await getSummaryFromUrl(sub.url)
        
        return {
            [r_prefix] : {
                summary: summary,
                url_top: `https://reddit.com/${r_prefix}/top`
            }
        }
    }))

    subreddits = subreddits.reduce((total, next) => Object.assign(total, next), {})
    return subreddits
}

const getSummaryFromUrl = async (url) => {
    const query = `${url}/top.json?t=day&limit=3`

    let result = []
    const body = await request(query, { json: true, 'User-Agent': 'audibene' })
    const posts = body.data.children

    posts.forEach((post) => {
        const {name, title, url, ups, permalink} = post.data

        result.push({
            name,
            title,
            ups: formatUpvotes(ups), 
            permalink: `https://reddit.com${permalink}`,
            url
        })
    })

    return result
}

const formatUpvotes = (num) => {
    const UNITS = ['', 'K', 'M', 'B']
    num = Number(num)

    for (let i = 3; i >= 1; i--) {
        if (num >= 1e3 ** i) {
            return `${(num/(1e3 ** i)).toFixed(1)}${UNITS[i]}`
        }
    }
    return num.toString()
}

module.exports = {
    generateSummaries
}
