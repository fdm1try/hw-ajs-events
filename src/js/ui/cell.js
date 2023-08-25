export default class GameCell {
  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('game-cell');
  }

  contains(entity) {
    if (!entity.container || !(entity.container instanceof HTMLElement)) {
      return false;
    }
    return entity.container.parentElement === this.container;
  }

  push(entity) {
    if (!entity.container || !(entity.container instanceof HTMLElement)) {
      throw new Error('Entity must have a container intance of HTMLElement');
    }
    this.container.appendChild(entity.container);
  }

  clear() {
    this.container.innerHTML = '';
  }

  get isEmpty() {
    return this.container.children.length === 0;
  }
}
