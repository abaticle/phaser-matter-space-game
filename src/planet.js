import Phaser from 'phaser'
import { PLANET_ROTATION_SPEED_MODIFIER, PLANET_SPEED_MODIFIER } from '../data/constants'
import { rotate } from '../src/tools'

class Planet extends Phaser.GameObjects.GameObject {
  /** @type {String} */
  #description

  /** @type {Planet} */
  #parent

  /** @type {Phaser.GameObjects.Arc} */
  #shape

  /** @type {Phaser.GameObjects.Arc} */
  #orbit

  /** @type {Number} */
  #speed

  /** @type {Number} */
  #parentDistance

  /** @type {MatterJS.BodyType} */
  #body

  /** @type {Number} */
  #rotationSpeed

  /** @type {Number} */
  #delta

  /**
   * Create a Planet
   * @constructor
   * @param {Object} options
   * @param {Phaser.Scene} options.scene
   * @param {String} options.name
   * @param {String} options.description
   * @param {Number} options.x
   * @param {Number} options.y
   * @param {Number} options.radius
   * @param {Number} options.color
   * @param {Planet} options.parent
   * @param {Number} options.speed
   * @param {Number} options.parentDistance
   */
  constructor({
    scene,
    name = '',
    description = '',
    x = 0,
    y = 0,
    radius = 50,
    color = 0xffffff,
    parent = undefined,
    speed = 0.1,
    rotationSpeed = 1,
    parentDistance,
    mass
  }) {
    super(scene, 'planet')

    this.setName(name)

    this.#description = description
    this.#shape = scene.add.circle(x, y, radius, color)
    this.#parent = parent
    this.#speed = speed
    this.#rotationSpeed = rotationSpeed
    this.#parentDistance = parentDistance
    this.#body = scene.matter.add.circle(x, y, radius, {
      label: description,
      isStatic: true,
      //mass: mass,
      //inverseMass: 1 / mass,
      attractors: [
        this._attract.bind(this)
      ]
    })

    scene.matter.add.gameObject(this.#shape, this.#body)

    this._drawOrbit()

    this._shader()

    this.#shape.setToTop()
  }


  _shader() {
  }

  /**
   * 
   * @param {Phaser.Physics.Matter.} bodyA 
   * @param {*} bodyB 
   * @returns {ForceVector}
   */
  _attract(bodyA, bodyB) {
    if (bodyB.label !== 'Spaceship') return

    //console.log(`${bodyA.label} <- ${bodyB.label}`)
    return {
      x: (bodyA.position.x - bodyB.position.x) * 0.000001 * this.#delta,
      y: (bodyA.position.y - bodyB.position.y) * 0.000001 * this.#delta
    }
  }

  /**
   * Get planet position
   * @returns {Phaser.Types.Math.Vector2Like}
   */
  getPosition() {
    return {
      x: this.#shape.x,
      y: this.#shape.y
    }
  }

  _drawOrbit() {
    if (!this.#parent) {
      return
    }

    const { x, y } = this.#parent.getPosition()
    this.#orbit = this.scene.add.circle(x, y, this.#parentDistance)
    this.#orbit.setStrokeStyle(2, 0xbababa)
    this.#orbit.anc
  }

  /**
   * Update planet
   * @param {Number} time Total time
   * @param {Number} delta Delta time
   */
  update(time, delta) {
    this.#delta = delta
    if (this.#parent) {
      const parentPosition = this.#parent.getPosition()

      const newPosition = Phaser.Math.RotateAroundDistance(
        this.getPosition(),
        parentPosition.x,
        parentPosition.y,
        this.#speed * delta * PLANET_SPEED_MODIFIER,
        this.#parentDistance
      )

      // Update planet pos
      this.#shape.setPosition(newPosition.x, newPosition.y)
      

      // Update orbit pos
      this.#orbit.setPosition(parentPosition.x, parentPosition.y)
    }
    this.#shape.setRotation(this.#shape.rotation + (this.#rotationSpeed * delta * PLANET_ROTATION_SPEED_MODIFIER))
  }
}

export default Planet
