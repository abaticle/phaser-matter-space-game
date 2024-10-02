import { GAME_DEFAULT_SPEED, GAME_DEFAULT_ZOOM, KEYS } from '../data/constants'
import Planet from '../src/planet'
import PlanetManager from '../src/planet-manager'
import Spaceship from '../src/spaceship'
import { CSVToJSON } from '../src/tools'
import Phaser from 'phaser'

class Space extends Phaser.Scene {
  #keys = {}

  /**
   * Planet manager
   * @type {PlanetManager}
   */
  #planetManager

  /**
   * Main camera
   * @type {Phaser.Cameras.Scene2D.Camera}
   */
  #camera

  /**
   * Spacefhip
   * @type {Spaceship}
   */
  #spaceship

  /**
   * Game speed
   * @type {Number}
   */
  #gameSpeed = GAME_DEFAULT_SPEED

  preload() {
    this.#planetManager = new PlanetManager()
    this.load.text({
      key: 'planets',
      url: 'data/planets.csv'
    })
  }

  create() {
    this.createPlanets()
    this.createSpaceship()
    this.createCamera()
    this.createMouseInputs()
    this.createKeyboardInputs()
  }

  /**
   * Create Camera
   */
  createCamera() {
    this.#camera = this.cameras.main
    this.#camera.setZoom(GAME_DEFAULT_ZOOM)
  }

  /**
   * Initiate keyboard
   */
  createKeyboardInputs() {
    Object.keys(KEYS).forEach((key) => {
      const keyNames = KEYS[key]

      keyNames.forEach((keyName) => {
        this.#keys[key] = this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes[keyName]
        )
      })
    })
  }

  /**
   * Initiate Mouse
   */
  createMouseInputs() {
    this.input.on(
      Phaser.Input.Events.POINTER_DOWN,
      this.onPointerDown.bind(this)
    )
    this.input.on(
      Phaser.Input.Events.POINTER_MOVE,
      this.onPointerMove.bind(this)
    )
    this.input.on(
      Phaser.Input.Events.POINTER_WHEEL,
      this.onPointerWheel.bind(this)
    )
  }

  /**
   *
   */
  getPlanetsFromCSV() {
    let planets = CSVToJSON(this.cache.text.get('planets'))

    planets = planets.map((planet) => {
      planet.radius = parseInt(planet.radius)
      planet.parentDistance = parseInt(planet.parentDistance)
      planet.speed = parseFloat(planet.speed)
      planet.color = parseInt(planet.color, 16)
      planet.mass = parseInt(planet.mass)
      planet.active = planet.active === 'X'

      return planet
    })

    return planets
  }

  /**
   * Create some planets
   */
  createPlanets() {
    const planets = this.getPlanetsFromCSV()

    planets.forEach((planet) => {
      if (!planet.active) {
        return
      }

      const newPlanet = new Planet({
        scene: this,
        name: planet.name,
        description: planet.description,
        radius: planet.radius,
        color: planet.color,
        speed: planet.speed,
        rotationSpeed: planet.rotationSpeed,
        parentDistance: planet.parentDistance,
        parent: planet.parentName
          ? this.#planetManager.getPlanet(planet.parentName)
          : undefined,
        mass: planet.mass
      })

      this.#planetManager.addPlanet(newPlanet)
    })
  }

  /**
   * Create spaceship
   */
  createSpaceship() {
    this.#spaceship = new Spaceship({
      scene: this,
      x: 200,
      y: 0,
      maxspeed: 10,
      name: 'spaceship',
      description: 'Spaceship' 
    })
  }

  /**
   * Handle keyboard keys
   * @param {Number} delta Delta time
   */
  handleKeys(delta) {
    if (this.#keys.GAME_SPEED_UP.isDown) {
      this.#gameSpeed += 1
    }

    if (this.#keys.GAME_SPEED_DOWN.isDown) {
      this.#gameSpeed -= 1
    }
    if (this.#keys.UP.isDown) {
      this.#spaceship.thrust(true)
    }
    if (this.#keys.DOWN.isDown) {
      this.#spaceship.thrust(false)
    }
    if (this.#keys.LEFT.isDown) {
      this.#spaceship.steer(true)
    }
    if (this.#keys.RIGHT.isDown) {
      this.#spaceship.steer(false)
    }
    if (!this.#keys.RIGHT.isDown && !this.#keys.LEFT.isDown) {
      this.#spaceship.stopSteer()
    }
  }

  /**
   * Mouse click event handler
   * @param {Phaser.Input.Pointer} pointer
   */
  onPointerDown(pointer) {}

  /**
   * Mouse move event handler
   * @param {Phaser.Input.Pointer} pointer
   */
  onPointerMove(pointer) {
    if (!pointer.isDown) {
      return
    }

    const { x, y } = pointer.velocity

    this.#camera.scrollX -= (x * 0.1) / this.#camera.zoom
    this.#camera.scrollY -= (y * 0.1) / this.#camera.zoom
  }

  /**
   * Mouse move event handler
   * @param {Phaser.Input.Pointer} pointer
   */
  onPointerWheel(pointer, gameObjects, deltaX, deltaY, deltaZ) {
    const worldPoint = this.#camera.getWorldPoint(pointer.x, pointer.y)
    const newZoom = this.#camera.zoom - this.#camera.zoom * 0.011 * deltaY
    this.#camera.zoom = Phaser.Math.Clamp(newZoom, 0.1, 20)

    this.#camera.preRender()
    const newWorldPoint = this.#camera.getWorldPoint(pointer.x, pointer.y)
    this.#camera.scrollX -= newWorldPoint.x - worldPoint.x
    this.#camera.scrollY -= newWorldPoint.y - worldPoint.y

    console.log(`New zoom: ${this.#camera.zoom}`)
  }

  update(time, delta) {
    this.handleKeys(delta)
    this.#planetManager.update(time, delta * this.#gameSpeed)

    // TOFIX: pourquoi startfollow ca marche pas ??
    this.#camera.scrollX =
      this.#spaceship.getPosition().x - window.innerWidth / 2
    this.#camera.scrollY =
      this.#spaceship.getPosition().y - window.innerHeight / 2
  }
}

export default Space
