const Sequelize = require('sequelize')
const pokeData = require('./pokemon-data.json')
const InsertPoke = require('./InsertPoke')

const insertPoke = new InsertPoke(pokeData)

const sequelize = new Sequelize('mysql://root:@localhost/sql_intro')

// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     })

const insertTypes = async types => {
    for (let type of types) {
        await sequelize
            .query(`INSERT INTO pokemon_type VALUES(null, "${type}")`)
    }
}

const insertTowns = async towns => {
    for (let town of towns) {
        await sequelize
            .query(`INSERT INTO town VALUES(null, "${town}")`)
    }
}

const insertTrainers = async trainers => {
    for (let trainer of Object.keys(trainers)) {
        let townId = await sequelize
            .query(`SELECT id FROM town WHERE town = "${trainers[trainer]}"`)
        await sequelize
            .query(`INSERT INTO trainer VALUES(null, "${trainer}", ${townId[0][0].id})`)
    }
}

const insertPokemon = async pokemon => {
    for (let poke of pokemon) {
        let typeId = await sequelize
            .query(`SELECT id FROM pokemon_type WHERE type = "${poke.type}"`)
        await sequelize
            .query(`INSERT INTO pokemon VALUES(${poke.id}, "${poke.name}", ${typeId[0][0].id}, ${poke.height}, ${poke.weight})`)
    }
}

const insertOwners = async pokeObject => {
    for (let pokeId of Object.keys(pokeObject)) {
        for (let owner of pokeObject[pokeId]) {
            let ownerId = await sequelize
                .query(`SELECT id FROM trainer WHERE name = "${owner}"`)
            await sequelize
                .query(`INSERT INTO pokemon_trainer VALUES(${pokeId}, ${ownerId[0][0].id})`)
        }
    }
}

const insertAll = async () => {
    await insertTypes(insertPoke.getTypes())
    await insertTowns(insertPoke.getTowns())
    await insertTrainers(insertPoke.getTrainers())
    await insertPokemon(pokeData)
    await insertOwners(insertPoke.generateOwners())
}

// insertAll()


//Exercises:

//1.

