import GameCell from './cell';

export default class GameUI {
  constructor(container, boardSize = 4) {
    this.container = container;
    this.boardSize = boardSize;
    this.cellClickListeners = [];
    this.checkDOMContainer();
    this.onClick = this.onClick.bind(this);
    this.removeModal = this.removeModal.bind(this);
    this.container.addEventListener('click', this.onClick);
  }

  checkDOMContainer() {
    if (!this.container || !(this.container instanceof HTMLElement)) {
      throw new Error('HTML container not found!');
    }
    return true;
  }

  draw() {
    this.checkDOMContainer();
    this.container.innerHTML = '';
    this.cells = [];
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cell = new GameCell();
      this.container.appendChild(cell.container);
      this.cells.push(cell);
    }
  }

  getRandomEmptyCell() {
    let cell;
    while (!cell || !cell.isEmpty) {
      cell = this.cells[Math.round(Math.random() * (this.cells.length - 1))];
    }
    return cell;
  }

  showModal(title, text, closeable = true) {
    this.removeModal();
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <div class='modal-container'>
        <h2 class="modal-title">${title}</h2>
        <div class="modal-text">${text}</div>
      </div>
    `;
    if (closeable) {
      const okBtn = document.createElement('button');
      okBtn.addEventListener('click', this.removeModal);
      okBtn.innerText = 'Ok';
      okBtn.classList.add('modal-confirm');
      const container = modal.children[0];
      container.appendChild(okBtn);
    }
    document.body.appendChild(modal);
    this.activeModal = modal;
    return modal;
  }

  removeModal() {
    if (this.activeModal) {
      this.activeModal.remove();
      this.activeModal = null;
    }
    return true;
  }

  onClick(event) {
    event.stopPropagation();
    const cellContainer = event.target.closest('.game-cell');
    if (cellContainer) {
      this.onCellClick(this.cells.find((cell) => cell.container === cellContainer));
    }
  }

  onCellClick(cell) {
    for (const callback of this.cellClickListeners) {
      callback(cell);
    }
  }

  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  removeCellClickListener(callback) {
    this.cellClickListeners = this.cellClickListeners.filter((listener) => listener !== callback);
  }

  hitAnimation(cell, time = 500) {
    return new Promise((resolve, reject) => {
      if (!this.cells.includes(cell)) {
        reject(new Error('Cell not found!'));
        return;
      }
      cell.container.classList.add('game-action-hit');
      setTimeout(this.onHitAnimationEnd.bind(this, cell, resolve), time);
    });
  }

  onHitAnimationEnd(cell, callback) {
    if (this.cells.includes(cell)) {
      cell.container.classList.remove('game-action-hit');
      callback(cell);
    }
  }
}
