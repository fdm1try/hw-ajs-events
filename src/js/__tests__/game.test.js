import Game from '../game';
import GameUI from '../ui/gameUI';

jest.useFakeTimers();
jest.spyOn(global, 'clearTimeout');

const mockSpyOnGameUIdraw = jest.spyOn(GameUI.prototype, 'draw');
const mockSpyOnGameUIhitAnimation = jest.spyOn(GameUI.prototype, 'hitAnimation');
const mockSpyOnGameUIaddCellClickListener = jest.spyOn(GameUI.prototype, 'addCellClickListener');
const mockSpyOnGameOnCellClick = jest.spyOn(Game.prototype, 'onCellClick');
const mockSpyOnGameOnMoveEnd = jest.spyOn(Game.prototype, 'onMoveEnd');
const mockSpyOnGameOver = jest.spyOn(Game.prototype, 'gameOver');

function dispatchEvent(el, eventType) {
  const event = new MouseEvent(eventType, {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(event);
}

let gameUI;

beforeAll(() => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  gameUI = new GameUI(container);
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

test('The Game() constructor throws an error if GameUI was not passed', () => {
  const check = () => new Game();
  expect(check).toThrow();
});

test('After initialization, the playing field is drawn on the screen and the event of clicking on the cell begins listening.', () => {
  const game = new Game(gameUI);
  game.init();
  expect(mockSpyOnGameUIdraw).toHaveBeenCalled();
  expect(mockSpyOnGameUIaddCellClickListener).toHaveBeenCalledWith(game.onCellClick);
});

test(
  'After clicking on a cell in which there is no enemy character, the number of points is not added, the number of errors increases by 1',
  () => {
    const game = new Game(gameUI);
    game.init();
    game.run();
    const cell = game.ui.getRandomEmptyCell();
    dispatchEvent(cell.container, 'click');
    expect(mockSpyOnGameOnCellClick).toHaveBeenCalledWith(cell);
    expect(clearTimeout).toHaveBeenCalled();
    expect(game.points).toBe(0);
    expect(game.fails).toBe(1);
  },
);

test('After clicking on the enemy character\'s cell, the number of points increases by 1', () => {
  const game = new Game(gameUI);
  game.init();
  game.run();
  const cell = game.ui.cells.find((item) => item.contains(game.enemy));
  dispatchEvent(cell.container, 'click');
  expect(mockSpyOnGameUIhitAnimation).toHaveBeenCalledWith(cell);
  expect(game.fails).toBe(0);
  expect(game.points).toBe(1);
});

test('When the activity timer expires, the onMoveEnd() function is called', () => {
  const game = new Game(gameUI);
  game.init();
  game.run();
  jest.runOnlyPendingTimers();
  expect(mockSpyOnGameOnMoveEnd).toHaveBeenCalledWith();
});

test('After 5 unsuccessful attempts, the game ends.', () => {
  const game = new Game(gameUI);
  game.init();
  game.fails = 4;
  game.run();
  jest.runOnlyPendingTimers();
  expect(mockSpyOnGameOver).toHaveBeenCalled();
});
