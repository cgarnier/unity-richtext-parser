/**
 * Check if input is a string
 * @param s
 */
const isString = (s) => typeof s === 'string' || s instanceof String;

/**
 * Unity colors
 * @type {[*]}
 */
const colors = [
  {name: 'aqua', color: '#00ffff'},
  {name: 'black', color: '#000000'},
  {name: 'blue', color: '#0000ff'},
  {name: 'brown', color: '#a52a2a'},
  {name: 'cyan', color: '#00ffff'},
  {name: 'darkblue', color: '#0000a0'},
  {name: 'fuchsia', color: '#ff00ff'},
  {name: 'green', color: '#008000'},
  {name: 'grey', color: '#808080'},
  {name: 'lightblue', color: '#add8e6'},
  {name: 'lime', color: '#00ff00'},
  {name: 'magenta', color: '#ff00ff'},
  {name: 'maroon', color: '#800000'},
  {name: 'navy', color: '#000080'},
  {name: 'olive', color: '#808000'},
  {name: 'orange', color: '#ffa500'},
  {name: 'purple', color: '#800080'},
  {name: 'red', color: '#ff0000'},
  {name: 'silver', color: '#c0c0c0'},
  {name: 'teal', color: '#008080'},
  {name: 'white', color: '#ffffff'},
  {name: 'yellow', color: '#ffff00'}
];

const hexReg = /#[a-fA-F0-9]{8}/;
const parsers = {
  'color': {
    pattern: /<color=([^>]*)>(.*?)<\/color>/,
    replace: (input, one, two) => {
      let color = colors.find(c => c.name === one);
      if (color) {
        return `<span style="color: ${color.color};">${two}</span>`
      }

      if (!one.match(hexReg)) {
        throw new Error('Wrong color code or color name')
      }

      return `<span style="color: ${one.slice(0,7)};">${two}</span>`}
  }
};

/**
 * Unity RichText parser
 * https://docs.unity3d.com/Manual/StyledText.html
 */
class Parser {
  constructor () {
    this.colors = colors
  }

  /**
   * Parse a richtext string and compile it to html
   * @param input {string} unity richtext string
   * @returns {string} html result
   * @throws {Error} Parsing error exception
   */
  parse (input) {
    if (!isString(input)) {
      throw new Error('Parsing error, input must be a string')
    }
    while (input.match(parsers.color.pattern)) {
      input = input.replace(parsers.color.pattern, parsers.color.replace)
    }
    return input
  }
}

module.exports = new Parser();