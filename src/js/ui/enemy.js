import EnemyImage from '../../img/goblin.png';

export default class Enemy {
  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('game-enemy');
    const image = document.createElement('img');
    image.src = EnemyImage;
    image.classList.add('game-enemy-img');
    this.container.appendChild(image);
  }
}
