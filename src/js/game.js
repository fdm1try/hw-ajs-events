import Enemy from './ui/enemy';
import GameUI from './ui/gameUI';

export default class Game {
  constructor(gameUI) {
    if (!gameUI || !(gameUI instanceof GameUI)) {
      throw new Error('GameUI should be set');
    }
    this.ui = gameUI;
    this.enemy = new Enemy();
    this.enemyVisibilityTime = 1000;
    this.onCellClick = this.onCellClick.bind(this);
    this.onMoveEnd = this.onMoveEnd.bind(this);
  }

  init() {
    this.points = 0;
    this.fails = 0;
    this.ui.draw();
    this.ui.addCellClickListener(this.onCellClick);
  }

  onCellClick(cell) {
    if (this.actionTimeout) {
      clearTimeout(this.actionTimeout);
      this.actionTimeout = null;
    }
    if (cell.contains(this.enemy)) {
      this.points += 1;
      this.ui.hitAnimation(cell);
    } else {
      this.fails += 1;
    }
    this.onMoveEnd(true);
  }

  onMoveEnd(userAction = false) {
    if (!userAction) {
      this.fails += 1;
    }
    if (this.fails >= 5) {
      this.gameOver();
    } else {
      this.moveEnemy();
    }
  }

  moveEnemy() {
    const cell = this.ui.getRandomEmptyCell();
    cell.push(this.enemy);
    this.actionTimeout = setTimeout(this.onMoveEnd, this.enemyVisibilityTime);
  }

  gameOver() {
    this.ui.removeCellClickListener(this.onCellClick);
    this.ui.showModal('Game Over!', `You scored ${this.points} points`, false);
  }

  run() {
    this.moveEnemy();
  }
}
