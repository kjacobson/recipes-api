const fastify = require('fastify')
const helmet = require('fastify-helmet')
// const rTracer = require('cls-rtracer')

const db = require('./db.js')
const pgErrors = require('./errors.js')

const DEFAULT_PAGE_SIZE = 20

const app = fastify(
    {
        logger: true,
        ignoreTrailingSlash: true
    }
)
app.register(helmet)
// app.register(rTracer.fastifyMiddleware())

// TODO: middleware to make sure user owns the resource in question


const retrieveError = (err, code, type) => {
    let response = pgErrors[err.code]
    if (response ) {
        return response
    } else {
        return { code, type }
    }
}

app.get('/recipes/', (req, reply) => {
    const { offset, count } = req.params
    db('recipes').offset(offset || 0).limit(count || DEFAULT_PAGE_SIZE).then((response) => {
        reply.send(response)
    }, (err) => {
        reply.code(404).send({error : "Not Found"})
    })
})
app.get('/recipes/:id', (req, reply) => {
    db.from('recipes').where('id', req.params.id).then((response) => {
        if (response.length) {
            return reply.send(response[0])
        }
        return reply.code(404).send({error : "Not Found"})
    }, (err) => {
        console.error(err)
        return reply.code(404).send({error : "Not Found"})
    })
})
app.put('/recipes/:id', (req, reply) => {

})
app.delete('/recipes/:id', (req, reply) => {

})

app.get('/users/:user_id/recipes/', (req, reply) => {
    db.from('recipes').where('user_id', req.params.user_id).then((response) => {
        return reply.send(response)
    }, (err) => {
        console.error(err)
        return reply.code(404).send({error : "Not Found"})
    })
})

app.post('/users/:user_id/recipes/', (req, reply) => {
    console.log(req.params.user_id)
    const { url, title, json } = req.body
    const { user_id } = req.params
    db('recipes').insert({
        title,
        user_id,
        json
    }, ['id']).then((result) => {
        return reply.code(201).send(result[0])
    }, (err) => {
        console.log('Did not succeed in saving recipe')
    })
})

app.get('/users', (req, reply) => {
    const { offset, count } = req.params
    db('users').offset(offset || 0).limit(count || DEFAULT_PAGE_SIZE).then((response) => {
        reply.send(response)
    }, (err) => {
        reply.code(404).send({error : "Not Found"})
    })
})

app.post('/users', (req, reply) => {
    const { email } = req.body
    db('users').insert({
        email
    }, ['id']).then((result) => {
        return reply.code(201).send(result[0])
    }, (err) => {
        console.error(err)
        const { code, type } = retrieveError(err, 400, 'ACCOUNT_CREATION_FAILED')
        return reply.code(code).send(type)
    })
})

app.put('/users/:id', (req, reply) => {
    const { verified } = req.body
    db.from('users').where('id', req.params.id)
        .update({
            verified
        }).then((result) => {
            return reply.code(204).send(result[0])
        }, (err) => {
            console.error(err)
            const { code, type } = retrieveError(err, 400, 'ACCOUNT_UPDATE_FAILED')
            return reply.code(code).send(type)
        })
})

app.get('/users/:id', (req, reply) => {
    db.from('users').where('id', req.params.id).then((response) => {
        if (response.length) {
            const user = response[0]
            return reply.send(user)
        } else {
            return reply.code(404).send('{"error" : "Not Found"}')
        }
    }, (err) => {
        console.error(err)
        return reply.code(404).send('{"error" : "Not Found"}')
    })
})

app.get('/users-by-email', (req, reply) => {
    db.from('users').where('email', req.query.email).then((response) => {
        if (response.length) {
            const userId = response[0].id
            return reply.send(userId)
        } else {
            return reply.code(404).send('{"error" : "Not Found"}')
        }
    }, (err) => {
        console.error(err)
    })
})

app.listen(process.env.PORT || 3004, process.env.HOST || 'localhost', (error) => {
    if (error) {
        app.log.error(error)
        return process.exit(1)
    } else {
        app.log.info('Listening on port: ' + 3004 + '.')
    }
})
