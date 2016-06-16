'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {

  const ethalon = ' _     _  _     _  _  _  _  _ \n'+
                  '| |  | _| _||_||_ |_   ||_||_|\n'+
                  '|_|  ||_  _|  | _||_|  ||_| _|\n';
  
  const ethalonLength = 10;
  const BALength = 9;
  const lineHeight = 3;
  
  function splitToComponents (BAstr, numCount) {
    let sum = '';
    BAstr = BAstr.split('').filter(a => a !== '\n').map((a, i) => {
      sum += a;

      if ((i+1) % lineHeight !== 0) return;

      var x = sum;
      sum = '';
      return x;
    }).filter(a => a);
    
    return BAstr.map((a,i) => {
      if (i > numCount-1) return;
      return a.concat(BAstr[i+numCount]).concat(BAstr[i+numCount*2]);
    }).slice(0, numCount);  
  }
  
  let ethalonComponents = splitToComponents(ethalon, ethalonLength);
  let result = splitToComponents(bankAccount, BALength);
 
  return result.map(a => ethalonComponents.indexOf(a)).join('');
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function wrapText(text, columns) {
  let result = text.match(/\w*\W/ig);
  let sum = '';

  result = result.map((item,i) => {
    sum += item;

    if((sum + (result[i+1] || result[-1])).length <= columns) return;

    let y = sum.trim();
    sum = '';
    return y;
    
  }).filter(a => a);

  if(sum) result.push(sum);

  return result;
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {

  function getCardRank(card) {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let cardRank = card.slice(0, -1);
    return ranks.indexOf(cardRank);
  }
  
  function defineFlush(hand) {
    let flush = hand.every( a => a['suit'] === hand[0]['suit'] );
    return flush ? 5 : 0;
  }

  function defineStraight(hand) {
    let ranks = hand.map(a => a['rank']).sort((a,b) => a - b);
    let len = ranks.length;
    let uniqRanks = ranks.filter((a, i) => ranks.indexOf(a) === i);

    if (uniqRanks.length !== len) return 0;

    let ranks2 = ranks.map(a => {
      return (a === 0) ? 13 : a;
    }).sort((a,b) => a - b);
    let isStraight = (ranks[len- 1] - ranks[0]) === (len - 1);
    let isStraight2 = (ranks2[len - 1] - ranks2[0]) === (len - 1);

    return (isStraight || isStraight2) ? 4 : 0;
  }

  function defineCombination(hand) {
    let ranks = hand.map(a => a['rank']);
    let uniqRanks = ranks.filter((a, i) => ranks.indexOf(a) === i);
    
    if (uniqRanks.length === ranks.length) return 0;
    
    let matches = uniqRanks.map((a,i) => {
      return ranks.filter((b) => b === a).length;
  });

    if (matches.indexOf(4) !== -1) return 7;
    if (matches.indexOf(3) !== -1 && matches.indexOf(2) !== -1) return 6;
    if (matches.indexOf(3) !== -1) return 3;
    if (matches.indexOf(2) !== -1 && (matches.indexOf(2) !== matches.lastIndexOf(2))) return 2;
    if (matches.indexOf(2) !== -1) return 1;
  }

  hand = hand.map(a => {
    return {
      rank: getCardRank(a),
      suit: a.slice(-1)
    };
  });
  
  let sum = defineFlush(hand) + defineStraight(hand) + defineCombination(hand);

  return sum < 9 ? sum : 8;

}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function getFigureRectangles(figure) {

  function drawRectangle(width, height) {
    let innerWidth = width - 2;
    let innerHeight = height - 2;
    let horSide = '+' + '-'.repeat(innerWidth) + '+\n';
    let vertSide = '|' + ' '.repeat(innerWidth) + '|\n';
    return horSide + vertSide.repeat(innerHeight) + horSide;
  }
   
  let layers = figure.split('\n').filter(a => a).map(a => a.split(''));
  
  let topCoords = layers.map((a, i) => {
    if(a.indexOf('+') === -1) return;
    return i;
  }).filter(a => typeof(a) === 'number');

  let rectHeightsArr = topCoords.map((a, i) => {
    return (topCoords[i+1] - a) + 1;
  }).filter(a => a);

  let outerSidesCoords = layers.map((a,i) => {
    return layers[i].map((b,i) => {
      if (b === ' ') return;
      return i;
    }).filter(a => typeof(a) === 'number');
  });

  let result = rectHeightsArr.map((a,i) => {

    let index = topCoords[i];
    let rectangles = outerSidesCoords[index].map((b,j) => {

      if (outerSidesCoords[index+1].indexOf(b) === -1) return;
      return b;
     
    }).filter(b => b !== undefined);

    return rectangles.map((b,j) => {
      if (rectangles[j+1] === undefined) return;
        let width = (rectangles[j+1] - b) + 1;
        let height = rectHeightsArr[i];
        return drawRectangle(width, height);
    }).filter(b => b); 
    
  });
  
  return [].concat.apply([],result);
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
