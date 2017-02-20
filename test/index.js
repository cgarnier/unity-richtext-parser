const assert = require('chai').assert;

const parser = require('../src/index');

describe('Parser', () => {
  it('Should be an object', () => {
    assert.isObject(parser, 'parser is an object')
  });
  it('Should have a `parse` method', () => {
    assert.isFunction(parser.parse, 'parse is a function')
  })
});

describe('Parser.parse', () => {
  it('Should return an string', () => {
    assert.isString(parser.parse('dfdf'), 'parse result is an string')
  });
  it('Should only handle string parameter', () => {
    assert.throws(() => {
      parser.parse({})
    }, 'Parsing error, input must be a string');
    assert.throws(() => {
      parser.parse(5)
    }, 'Parsing error, input must be a string');
    assert.throws(() => {
      parser.parse(() => null)
    }, 'Parsing error, input must be a string');
    assert.doesNotThrow(() => {
      parser.parse('Bla bla')
    }, 'Parsing error, input must be a string')
  });

  it('Should return input when input has not rich tag', () => {
    let res = parser.parse('Text with no tags');
    let expected = 'Text with no tags';
    assert.equal(res, expected, 'input matches output')
  })
});

describe('Bold', () => {
  const simple = '<b>a bold text</b>';
  const mixed = 'a text with a <b>bold</b> word';
  const harder = 'a <b>text</b> with <b>several</b><b>bold</b> words';
  const insame = 'some <b> imbrication <b>on <b> several <b> level</b> </b></b></b>';
  const unparsable = 'some <b> buged text';

  it('Should be able to parse a <b>', () => {
    let res = parser.parse(simple);
    assert.equal(res, '<b>a bold text</b>')
  });

  it('Should be able to parse string containing a <b>', () => {
    let res = parser.parse(mixed);
    assert.equal(res, 'a text with a <b>bold</b> word')
  });

  it('Should be able to parse several <b>', () => {
    let res = parser.parse(harder);
    assert.equal(res, 'a <b>text</b> with <b>several</b><b>bold</b> words')
  });

  it('should be able to parse a weird bold imbrication', () => {
    let res = parser.parse(insame);
    assert.equal(res, 'some <b> imbrication <b>on <b> several <b> level</b> </b></b></b>')
  })
});

describe('Colors', () => {
  const simple = '<color=green>a colored text</color>';
  const simpleHexa = '<color=#a7e8c9ff>a colored text</color>';
  const simpleHexaWrong = '<color=#a7e8c99>a colored text</color>';
  const simpleHexaWrong2 = '<color=#a7e8>a colored text</color>';
  const mixed = 'a text with a <color=green>colored</color> word';
  const harder = 'a <color=green>text</color> with <color=green>several</color><color=green>colored</color> words';
  const insame = 'some <color=green> imbrication <color=green>on <color=green> several <color=green> level</color> </color></color></color>';

  it('Should be able to parse a <color>', () => {
    let res = parser.parse(simple);
    assert.equal(res, '<span style=\"color: #008000;\">a colored text</span>')
  });

  it('Should be able to parse string containing a <span style=\"color: #008000;\">', () => {
    let res = parser.parse(mixed);
    assert.equal(res, 'a text with a <span style=\"color: #008000;\">colored</span> word')
  });

  it('Should be able to parse several <span style=\"color: #008000;\">', () => {
    let res = parser.parse(harder);
    assert.equal(res, 'a <span style=\"color: #008000;\">text</span> with <span style=\"color: #008000;\">several</span><span style=\"color: #008000;\">colored</span> words')
  });

  it('should be able to parse a weird colored imbrication', () => {
    let res = parser.parse(insame);
    assert.equal(res, 'some <span style=\"color: #008000;\"> imbrication <span style=\"color: #008000;\">on <span style=\"color: #008000;\"> several <span style=\"color: #008000;\"> level</span> </span></span></span>')
  });

  it('should be able to parse unity hex color', () => {
    assert.equal(parser.parse(simpleHexa), '<span style=\"color: #a7e8c9;\">a colored text</span>')
  });

  it('should be able to parse unity color codes', () => {
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

    colors.forEach((c) => {
      assert.equal(parser.parse(`<color=${c.name}>a colored text</color>`), `<span style="color: ${c.color};">a colored text</span>`)
    })
  });

  it('should throw a parsing error when hexa is not valid', () => {
    assert.throws(() => parser.parse(simpleHexaWrong), 'Wrong color code or color name');
    assert.throws(() => parser.parse(simpleHexaWrong2), 'Wrong color code or color name');
  })
});