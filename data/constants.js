/**
 * Planet speed modifier
 * @readonly
 * @type {Number}
 */
export const PLANET_SPEED_MODIFIER = 1

/**
 * Activate matterjs debug
 * @readonly
 * @type {Boolean}
 */
export const MATTER_DEBUG = false

/**
 * Default starting game speed
 * @readonly
 * @type {Number}
 */
export const GAME_DEFAULT_SPEED = 1

/**
 * Default starting camera zoom level
 * @readonly
 * @type {Number}
 */
export const GAME_DEFAULT_ZOOM = 2

/**
 * Keys 
 * @readonly
 * @enum {String[]}
 */
export const KEYS = {
  UP: ["NUMPAD_EIGHT", "UP"],
  DOWN: ["NUMPAD_TWO", "DOWN"],
  LEFT: ["NUMPAD_FOUR", "LEFT"],
  RIGHT: ["NUMPAD_SIX", "RIGHT"],
  GAME_SPEED_UP: ["NUMPAD_ADD", "PLUS"],
  GAME_SPEED_DOWN: ["NUMPAD_SUBTRACT", "MINUS"]
}