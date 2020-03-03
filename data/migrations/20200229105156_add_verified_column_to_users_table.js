exports.up = (knex) => {
    return knex.schema.table('users', table => {
        table.boolean('verified').defaultTo(false)
    })
}

exports.down = (knex) => {
    return knex.schema.table('users', table => {
        table.dropColumn('verified')
    })
}
