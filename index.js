const fastify = require('fastify')
const helmet = require('fastify-helmet')
const rTracer = require('cls-rtracer')

const db = require('./db.js')

const DEFAULT_PAGE_SIZE = 20

const app = fastify(
    {
        logger: true,
        ignoreTrailingSlash: true
    }
)
app.register(helmet)
// app.register(rTracer.fastifyMiddleware())

app.get('/recipes/', (req, reply) => {
    const { offset, count } = req.params
    db('recipes').offset(offset || 0).limit(count || DEFAULT_PAGE_SIZE).then((response) => {
        reply.send(JSON.stringify(response))
    }, (err) => {

    })
})
app.post('/recipes/', (req, reply) => {
    const { url, title, json } = req.body
    const recipes = db('recipes').insert({
        title,
        json
    }, ['id']).then((result) => {
        reply.send(JSON.stringify(result[0]))
    }, (err) => {
        console.log('Did not succeed in saving recipe')
    })
})
app.get('/recipes/:id', (req, reply) => {
    db.from('recipes').where('id', req.params.id).then((response) => {
        if (response.length) {
            reply.send(response[0])
        }
    })
})
app.put('/recipes/:id', (req, reply) => {

})
app.delete('/recipes/:id', (req, reply) => {

})

app.listen(3004, (error) => {
    if (error) {
        app.log.error(error)
        return process.exit(1)
    } else {
        app.log.info('Listening on port: ' + 3004 + '.')
    }
})
