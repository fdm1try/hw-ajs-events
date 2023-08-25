import Enemy from '../enemy';

test('The Enemy constructor creates an HTMLElement with the "game-enemy" class and stores it in the container property', () => {
  const enemy = new Enemy();
  expect(enemy.container).toBeInstanceOf(HTMLElement);
  expect(enemy.container.classList.contains('game-enemy')).toBeTruthy();
});
