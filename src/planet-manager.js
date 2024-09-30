import Planet from "./planet"

class PlanetManager {

  /**
   * @type {Planet}
   */
  #planets = []

  constructor() {

  }

  /**
   * 
   * @param {Planet} planet
   */
  addPlanet(planet) {
    this.#planets.push(planet)
  }

  addPlanets(planets) {
    this.#planets = [...this.#planets, ...planets]
  }

  getPlanet(name = '') {
    try {
      return this.#planets.find(planet => planet.name === name)
    } catch (error) {
      console.error(`Planet ${ name } doesn't exists`)
    }
  }

  update(time, delta) {
    this.#planets.forEach(planet => {
      planet.update(time, delta)
    })
  }
}

export default PlanetManager