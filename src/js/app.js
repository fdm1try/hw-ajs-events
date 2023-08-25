import Game from './game';
import GameUI from './ui/gameUI';

document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.querySelector('.game-container');
  const gameUI = new GameUI(gameContainer);
  const game = new Game(gameUI);
  game.init();
  game.run();
});
