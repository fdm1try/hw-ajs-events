import GameUI from '../gameUI';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');
const mockSpyOnGameUIonHitAnimationEnd = jest.spyOn(GameUI.prototype, 'onHitAnimationEnd');

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

test('The Game() constructor throws an error if HTMLElement was not passed as a container', () => {
  const check = () => new GameUI();
  expect(check).toThrow();
});

test('Checking the rendering of the cells of the playing field', () => {
  gameUI.draw();
  const cellsElements = gameUI.cells.map((cell) => cell.container);
  const htmlElements = [...gameUI.container.children];
  expect(cellsElements).toEqual(htmlElements);
});

test('The getRandomEmptyCell() function always returns only an empty cell', () => {
  gameUI.draw();
  const emptyCell = gameUI.cells[Math.round(Math.random() * (gameUI.cells.length - 1))];
  for (const cell of gameUI.cells) {
    if (cell !== emptyCell) {
      cell.push({ container: document.createElement('div') });
    }
  }
  expect(gameUI.getRandomEmptyCell()).toEqual(emptyCell);
});

test('Checking the rendering of a non-closeable modal window', () => {
  const title = 'TestModalTitle';
  const text = 'TestModalText';
  gameUI.showModal(title, text, false);
  const modal = document.querySelector('.modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalText = modal.querySelector('.modal-text');
  const modalOkBtn = modal.querySelector('.modal-confirm');
  expect(modalTitle.textContent).toBe(title);
  expect(modalText.textContent).toBe(text);
  expect(modalOkBtn).toBeNull();
});

test('Checking the rendering of a closeable modal window', () => {
  const title = 'TestModalTitle';
  const text = 'TestModalText';
  gameUI.showModal(title, text);
  const modal = document.querySelector('.modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalText = modal.querySelector('.modal-text');
  const modalOkBtn = modal.querySelector('.modal-confirm');
  expect(modalTitle.textContent).toBe(title);
  expect(modalText.textContent).toBe(text);
  expect(modalOkBtn).not.toBeNull();
});

test('After clicking on the cell, a callback is called, which was passed to addCellClickListener', () => {
  const callback = jest.fn();
  gameUI.draw();
  gameUI.addCellClickListener(callback);
  const cell = gameUI.cells[Math.round(Math.random() * (gameUI.cells.length - 1))];
  const entity = { container: document.createElement('div') };
  cell.push(entity);
  dispatchEvent(entity.container, 'click');
  expect(callback).toHaveBeenCalledWith(cell);
});

test('The removeCellClickListener function removes the callback and it does not work after clicking on the cell', () => {
  const callback = jest.fn();
  gameUI.draw();
  gameUI.addCellClickListener(callback);
  gameUI.removeCellClickListener(callback);
  const cell = gameUI.cells[Math.round(Math.random() * (gameUI.cells.length - 1))];
  dispatchEvent(cell.container, 'click');
  expect(callback).not.toHaveBeenCalled();
});

test('After clicking not on the cell, a callback is not called', () => {
  const callback = jest.fn();
  gameUI.draw();
  gameUI.addCellClickListener(callback);
  const element = document.createElement('div');
  gameUI.container.appendChild(element);
  dispatchEvent(element, 'click');
  expect(callback).not.toHaveBeenCalled();
});

test('An error is thrown after an attempt to start the hit animation without specifying a cell', () => {
  gameUI.draw();
  expect(gameUI.hitAnimation()).rejects.toThrow();
});

test('Upon completion of the hit animation, the onHitAnimationEnd() function is called with the parameters: cell, promise resolver', () => {
  gameUI.draw();
  const cell = gameUI.cells[0];
  const result = gameUI.hitAnimation(cell, 1359);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1359);
  jest.runOnlyPendingTimers();
  expect(mockSpyOnGameUIonHitAnimationEnd).toHaveBeenCalledWith(cell, expect.any(Function));
  expect(result).resolves.toBe(cell);
});

test('If the cell is not in the list, onHitAnimationEnd() does not execute the callback passed to it', () => {
  const callback = jest.fn();
  gameUI.draw();
  const cell = { container: document.createElement('div') };
  gameUI.onHitAnimationEnd(cell, callback);
  expect(callback).not.toHaveBeenCalled();
});
