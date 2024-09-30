//import Phaser from 'phaser'
import { PLANET_SPEED_MODIFIER } from '../data/constants'
import { rotate } from '../src/tools'

class Planet extends Phaser.GameObjects.GameObject {
  /** @type {String} */
  #description

  /** @type {Planet} */
  #parent

  /** @type {Phaser.GameObjects.Arc} */
  #shape

  /** @type {Number} */
  #speed

  /** @type {Number} */
  #parentDistance

  /** @type {MatterJS.BodyType} */
  #body

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
    parentDistance
  }) {
    super(scene, 'planet')

    this.setName(name)

    this.#description = description
    this.#shape = scene.add.circle(x, y, radius, color)
    this.#parent = parent
    this.#speed = speed
    this.#parentDistance = parentDistance
    this.#body = scene.matter.add.circle(x, y, radius, {
      isStatic: true
    })

    scene.matter.add.gameObject(this.#shape, this.#body)
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


  /**
   * Update planet
   * @param {Number} time Total time
   * @param {Number} delta Delta time
   */
  update(time, delta) {
    if (this.#parent) {
      const newPosition = Phaser.Math.RotateAroundDistance(
        this.getPosition(),
        this.#parent.getPosition().x,
        this.#parent.getPosition().y,
        this.#speed * delta * PLANET_SPEED_MODIFIER,
        this.#parentDistance
      )
      this.#shape.setPosition(newPosition.x, newPosition.y)
    }
  }
}

export default Planet
