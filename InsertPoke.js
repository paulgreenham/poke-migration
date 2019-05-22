class InsertPoke {
    constructor(pokeData) {
        this.pokemon = pokeData
        this.types = this.generateTypes()
        this.trainers = this.generateTrainers()
        this.towns = this.generateTowns()
    }

    generateTypes() {
        const types = new Set()
        this.pokemon.forEach(p => types.add(p.type))
        return types
    }

    generateTrainers() {
        const trainers = {}
        for (let p of this.pokemon) {
            for (let o of p.ownedBy) {
                if (!trainers[o.name]) {
                    trainers[o.name] = o.town
                }
            }
        }
        return trainers
    }

    generateTowns() {
        const towns = new Set()
        Object.keys(this.trainers).forEach(k => towns.add(this.trainers[k]))
        return towns
    }

    generateOwners() {
        const pokeObject = {}
        this.pokemon.forEach(p => pokeObject[p.id] = p.ownedBy.map(o => o.name))
        return pokeObject   //return object matching pokemon id (key) to array of owners (value)
    }

    getTypes() {return this.types}

    getTrainers() {return this.trainers}

    getTowns() {return this.towns}

}

module.exports = InsertPoke