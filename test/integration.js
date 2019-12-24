process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const expect = chai.expect

chai.use(chaiHttp)

const randomString = (length) => {
    return Math.random().toString(36).slice(-length)
}

let id 

describe('User handlers', () => {
    const name = randomString(5)
    const email = `${name}@example.com`
    const user = {
        name,
        email
    }

    it('should create a user', (done) => {
        chai.request(server)
            .post('/users')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('object')
                expect(res.body).to.have.property('id')
                id = res.body.id
                expect(res.body).to.have.property('name')
                expect(res.body).to.have.property('email')
                expect(res.body).to.have.property('isNotified')
                expect(res.body.name).to.equal(name)
                expect(res.body.email).to.equal(email)
                expect(res.body.isNotified).to.equal(true)
                done();
            });
    });

    it('should fail with a 400 to create a user without supplying a name and an email', (done) => {
        chai.request(server)
            .post(`/users`)
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(400)
                done();
            });
    });

    it('should retrieve a user', (done) => {
        chai.request(server)
            .get(`/users/${id}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('object')
                expect(res.body).to.have.property('id')
                expect(res.body).to.have.property('name')
                expect(res.body).to.have.property('email')
                expect(res.body).to.have.property('isNotified')
                expect(res.body.id).to.equal(id)
                expect(res.body.name).to.equal(name)
                expect(res.body.email).to.equal(email)
                done();
            });
    });

    it('should fail with a 404 to retrieve a non-existing user', (done) => {
        chai.request(server)
            .get(`/users/99999999`)
            .end((err, res) => {
                expect(res).to.have.status(404)
                done();
            });
    });

    it('should update a user', (done) => {
        newString = randomString(5)
        user.name = newString
        user.email = `${newString}@example.com`
        user.isNotified = false

        chai.request(server)
            .patch(`/users/${id}`)
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('object')
                expect(res.body).to.have.property('id')
                expect(res.body).to.have.property('name')
                expect(res.body).to.have.property('email')
                expect(res.body).to.have.property('isNotified')
                expect(res.body.id).to.equal(id)
                expect(res.body.name).to.equal(user.name)
                expect(res.body.email).to.equal(user.email)
                expect(res.body.isNotified).to.equal(false)
                done();
            });
    });

    it('should update a user partially', (done) => {
        newString = randomString(5)

        chai.request(server)
            .patch(`/users/${id}`)
            .send({
                name: newString
            })
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('object')
                expect(res.body).to.have.property('id')
                expect(res.body).to.have.property('name')
                expect(res.body).to.have.property('email')
                expect(res.body).to.have.property('isNotified')
                expect(res.body.id).to.equal(id)
                expect(res.body.name).to.equal(newString)
                expect(res.body.email).to.equal(user.email)
                expect(res.body.isNotified).to.equal(false)
                done();
            });
    });
});

describe('Subreddit handlers', () => {
    let url1, url2, id1, id2

    it('should add a subreddit to a user', (done) => {
        url1 = `https://reddit.com/r/${randomString(5)}`
        const subreddit = {
            url: url1,
        }
    
        chai.request(server)
            .post(`/users/${id}/subreddits`)
            .send(subreddit)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('object')
                expect(res.body).to.have.property('id')
                id1 = res.body.id
                expect(res.body).to.have.property('user_id')
                expect(res.body).to.have.property('url')
                expect(res.body.user_id).to.equal(id)
                expect(res.body.url).to.equal(url1)
                done();
            });
    });

    it('should add a second subreddit to a user', (done) => {
        url2 = `https://reddit.com/r/${randomString(5)}`
        const subreddit = {
            url: url2,
        }

        chai.request(server)
            .post(`/users/${id}/subreddits`)
            .send(subreddit)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('object')
                expect(res.body).to.have.property('id')
                id2 = res.body.id
                expect(res.body).to.have.property('user_id')
                expect(res.body).to.have.property('url')
                expect(res.body.user_id).to.equal(id)
                expect(res.body.url).to.equal(url2)
                done();
            });
    });

    it('should retrieve all subreddits for a user', (done) => {
        chai.request(server)
            .get(`/users/${id}/subreddits`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('array')
                expect(res.body.length).to.equal(2)
                expect(res.body[0]).to.have.property('id')
                expect(res.body[0]).to.have.property('user_id')
                expect(res.body[0]).to.have.property('url')
                expect(res.body[0].user_id).to.equal(id)
                expect(res.body[0].id).to.equal(id1)
                expect(res.body[0].url).to.equal(url1)
                expect(res.body[1]).to.have.property('id')
                expect(res.body[1]).to.have.property('user_id')
                expect(res.body[1]).to.have.property('url')
                expect(res.body[1].user_id).to.equal(id)
                expect(res.body[1].id).to.equal(id2)
                expect(res.body[1].url).to.equal(url2)
                done();
            });
    });

    it('should update a user\'s subreddit', (done) => {
        newUrl1 = `https://reddit.com/r/${randomString(5)}`
        const subreddit = {
            url: newUrl1,
        }

        chai.request(server)
            .patch(`/users/${id}/subreddits/${id1}`)
            .send(subreddit)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('object')
                expect(res.body).to.have.property('id')
                expect(res.body).to.have.property('user_id')
                expect(res.body).to.have.property('url')
                expect(res.body.user_id).to.equal(id)
                expect(res.body.id).to.equal(id1)
                expect(res.body.url).to.equal(newUrl1)
                done();
            });
    });
});