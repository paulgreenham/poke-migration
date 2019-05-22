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

const getHeaviest = async () => {
    let maxWeight = await sequelize
        .query("SELECT MAX(weight) AS weight FROM pokemon")
    let result = await sequelize
        .query(`SELECT name FROM pokemon WHERE weight = ${maxWeight[0][0].weight}`)
    console.log("The heaviest pokemon is: " + result[0][0].name)
    return result[0][0].name
}

// getHeaviest()


//2.

const getPokeByType = async type => {
    let poke = await sequelize
        .query(`
            SELECT p.name
            FROM pokemon AS p, pokemon_type AS t
            WHERE t.type = "${type}" AND p.type = t.id
        `)
    let pokemon = poke[0].map(p => p.name)
    console.log(pokemon)
    return pokemon
}

// getPokeByType("grass")


//3.

const getPokeOwners = async pokeName => {
    let trainers = await sequelize
        .query(`
            SELECT t.name
            FROM pokemon AS p, trainer AS t, pokemon_trainer AS pt
            WHERE p.name = "${pokeName}" AND p.id = pt.p_id AND t.id = pt.t_id
        `)
    let trainerList = trainers[0].map(t => t.name)
    console.log(trainerList)
    return trainerList
}

// getPokeOwners("gengar")


//4.

const getOwneredPoke = async trainerName => {
    let poke = await sequelize
        .query(`
            SELECT p.name
            FROM pokemon AS p, trainer AS t, pokemon_trainer AS pt
            WHERE t.name = "${trainerName}" AND p.id = pt.p_id AND t.id = pt.t_id
        `)
    let pokemon = poke[0].map(t => t.name)
    console.log(pokemon)
    return pokemon
}

// getOwneredPoke("Misty")


//5.

const mostOwned = async () => {
    let pokeIds = await sequelize
        .query(`
            SELECT COUNT(p_id), pt.p_id, p.name
            FROM pokemon_trainer AS pt, pokemon AS p
            WHERE p.id = pt.p_id
            GROUP BY pt.p_id
            ORDER BY COUNT(p_id) DESC
        `)
    let maxCount = pokeIds[0][0]["COUNT(p_id)"]
    pokemon = []
    for (poke of pokeIds[0]) {
        if (poke["COUNT(p_id)"] === maxCount) {
            pokemon.push(poke.name)
        }
        else { break }
    }
    console.log(pokemon.length > 1 ? pokemon : pokemon[0])
    return pokemon
}

// mostOwned()