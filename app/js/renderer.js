const d3 = require('d3');

const NUM_PHRASES = 53;
const VERT_PADDING = 15; // From style.css

const addPhraseSection = (parent, phraseNum) => {
  parent.append('section')
    .attr('id', `phrase-${phraseNum}`)
    .attr('class', 'phrase-section')
    .append('img')
    .attr('src', `phrases/${phraseNum}.svg`);
};

const colorById = (playerId, saturation = 0.4) => {
  const hue = (playerId * 100) % 355;
  return d3.hsl(hue, saturation, 0.6);
};

const scrollToPhrase = (phraseNum) => {
  const element = document.getElementById(`phrase-${phraseNum}`);
  const offsetTop = window.pageYOffset || document.documentElement.scrollTop;
  d3.transition()
    .duration(400)
    .tween('scroll', ((offset) => () => {
      const i = d3.interpolateNumber(offsetTop, offset);
      return (t) => window.scrollTo(0, i(t));
    })(offsetTop + element.getBoundingClientRect().top - VERT_PADDING));
};

module.exports.start = () => {
  const body = d3.select('body');
  for (let i = 1; i <= NUM_PHRASES; i += 1) {
    addPhraseSection(body, i);
  }
};

module.exports.update = (playerMatrix, changedPlayerId) => {
  // Wipe existing player ids
  d3.selectAll('section.phrase-section')
    .selectAll('div.players').remove();

  // Join list of players to list of phrases
  const divPlayers = d3.selectAll('section.phrase-section')
    .data(playerMatrix)
    .append('div')
    .attr('class', 'players');

  // Join players to phrase
  divPlayers.selectAll('span')
    .data((d) => d)
    .enter()
    .insert('span')
    .attr('id', (d) => `player-${d}`)
    .attr('class', 'player')
    .style('background-color', (d) => colorById(d).toString())
    .insert('span')
    .text((d) => d);

  // Animate changed player ID
  d3.transition()
    .select(`#player-${changedPlayerId}`)
    .duration(400)
    .styleTween('background-color', () => d3.interpolateHsl(colorById(changedPlayerId, 0.9), colorById(changedPlayerId)));

  // Find lowest playing phrase and scroll to it
  const phraseNum = playerMatrix.findIndex((x) => x.length !== 0) + 1;
  scrollToPhrase(phraseNum);
};
