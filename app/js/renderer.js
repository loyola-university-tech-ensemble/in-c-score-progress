'use strict';

const d3 = require('d3');
const NUM_PHRASES = 53;
const VERT_PADDING = 15; //From style.css

const addPhraseSection = (parent, phraseNum) => {
  parent.append('section')
    .attr('id', `phrase-${phraseNum}`)
    .attr('class', 'phrase-section')
    .append('img')
    .attr('src', `phrases/Sco${phraseNum}.png`);
}

const colorById = (cid) => {
  const hue = (cid * 100) % 355;
  return d3.hsl(hue, 0.4, 0.6);
}

const scrollToPhrase = (phraseNum) => {
  let element = document.getElementById(`phrase-${phraseNum}`);
  var offsetTop = window.pageYOffset || document.documentElement.scrollTop;
  d3.transition()
    .duration(400)
    .tween("scroll", (offset => () => {
      var i = d3.interpolateNumber(offsetTop, offset);
      return t => scrollTo(0, i(t))
    })(offsetTop + element.getBoundingClientRect().top - VERT_PADDING));
}

module.exports.start = () => {
  let body = d3.select('body');
  for(let i=1; i <= NUM_PHRASES; ++i) {
    addPhraseSection(body, i); 
  }
} 

module.exports.update = (playerMatrix) => {
  //Wipe existing player ids
  d3.selectAll('section.phrase-section')
    .selectAll('div.players').remove();

  //Join list of players to list of phrases
  let divPlayers = d3.selectAll('section.phrase-section')
    .data(playerMatrix)
    .append('div')
    .attr('class', 'players');

  //Join players to phrase
  let playerIds = divPlayers.selectAll('span')
    .data((d) => { return d; })
    .enter()
    .insert('span')
    .attr('class', 'player')
    .style('background-color', (d) => { 
      return colorById(d).toString(); 
    })
    .insert('span')
    .text((d) => { return d; });

  //Find lowest playing phrase and scroll to it
  let phraseNum = playerMatrix.findIndex(x => { return x.length != 0; }) + 1;
  scrollToPhrase(phraseNum);
}
