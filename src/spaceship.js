class Spaceship extends Phaser.GameObjects.GameObject {
  /** @type {Number} */
  #maxspeed

  /** @type {MatterJS.BodyType} */
  #body

  /** @type {String} */
  #description

  #shape

  /**
   * Create a Spaceship
   * @constructor
   * @param {Object} options
   * @param {Phaser.Scene} options.scene
   * @param {String} options.name
   * @param {String} options.description
   * @param {Number} maxspeed
   */
  constructor({
    scene,
    name = '',
    description = '',
    x = 0,
    y = 0,
    maxspeed = 1
  }) {
    super(scene, 'spaceship')
    this.setName(name)
    this.#description = description
    this.#maxspeed = maxspeed

    const vertices = [
      { x: 0, y: 0 },
      { x: 16, y: 5 },
      { x: 0, y: 10 }
    ]

    this.#body = scene.matter.add.fromVertices(100, 100, vertices)

    this.#shape = scene.add.polygon(
      this.#body.position.x,
      this.#body.position.y,
      vertices,
      0x8d8d8d
    )

    scene.matter.add.gameObject(this.#shape, this.#body, false)

    this.#body.gameObject.setFrictionAir(0)
    this.#body.gameObject.setMass(80)
    this.#body.gameObject.setFixedRotation()
  }

  /**
   *
   * @param {Boolean} isForward
   */
  thrust(isForward) {
    if (isForward) {
      this.#body.gameObject.thrust(0.08)
    } else {
      this.#body.gameObject.thrustBack(0.0005)
    }
  }
  /**
   *
   * @param {Boolean} isLeft
   */
  steer(isLeft) {
    if (isLeft) {
      this.#body.gameObject.setAngularVelocity(-0.05)
    } else {
      this.#body.gameObject.setAngularVelocity(0.05)
    }
  }

  stopSteer() {
    this.#body.gameObject.setAngularVelocity(0)
  }
  /**
   * Get spaceship position
   * @returns {Phaser.Types.Math.Vector2Like}
   */
  getPosition() {
    return {
      x: this.#shape.x,
      y: this.#shape.y
    }
  }
}

export default Spaceship
