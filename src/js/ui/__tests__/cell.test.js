import GameCell from '../cell';

test('The GameCell constructor creates an HTMLElement with the "game-cell" class and stores it in the container property', () => {
  const cell = new GameCell();
  expect(cell.container).toBeInstanceOf(HTMLElement);
  expect(cell.container.classList.contains('game-cell')).toBeTruthy();
});

test('The contains() method returns true when entity.container is a child of container element', () => {
  const cell = new GameCell();
  const entity = {
    container: document.createElement('div'),
  };
  cell.push(entity);
  expect(cell.contains(entity)).toBeTruthy();
});

test(
  'An error is thrown when an entity is added that does not have the container property or entity.container is not an instance of HTMLElement',
  () => {
    const cell = new GameCell();
    const entity = {
      container: null,
    };
    expect(cell.push.bind(cell, entity)).toThrow();
  },
);

test(
  'The contains() method returns false if entity does not have the container property or entity.container is not an instance of HTMLElement',
  () => {
    const cell = new GameCell();
    const entity = {
      container: document.createElement('div'),
    };
    cell.push(entity);
    entity.container = undefined;
    expect(cell.contains(entity)).toBeFalsy();
  },
);

test('The clear() method removes all child elements from the container', () => {
  const cell = new GameCell();
  const entity = {
    container: document.createElement('div'),
  };
  cell.push(entity);
  cell.clear();
  expect(cell.container.children.length).toBe(0);
});

test('By default, the cell is empty, after adding an entity, the isEmpty property will be false', () => {
  const cell = new GameCell();
  const entity = {
    container: document.createElement('div'),
  };
  expect(cell.isEmpty).toBeTruthy();
  cell.push(entity);
  expect(cell.isEmpty).toBeFalsy();
});
