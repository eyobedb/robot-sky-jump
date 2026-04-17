import Phaser from 'phaser';
import { soundManager } from '../utils/SoundManager';

export class MainScene extends Phaser.Scene {
  private basket!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private foodGroup!: Phaser.Physics.Arcade.Group;
  private score = 0;
  private lives = 3;
  private isRunning = false;
  private spawnTimer?: Phaser.Time.TimerEvent;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('MainScene');
  }

  preload() {
    // We'll use graphics to generate textures instead of external assets for reliability
    // Creating the Basket
    const basketGfx = this.make.graphics({ x: 0, y: 0, add: false });
    basketGfx.fillStyle(0xffffff, 1);
    basketGfx.fillRoundedRect(0, 0, 100, 20, 10);
    basketGfx.generateTexture('basket', 100, 20);

    // Creating the Food Icons (Blue circles)
    const foodGfx = this.make.graphics({ x: 0, y: 0, add: false });
    foodGfx.fillStyle(0x3b82f6, 1); // Blue-500
    foodGfx.fillCircle(15, 15, 15);
    foodGfx.generateTexture('food', 30, 30);
  }

  create() {
    const { width, height } = this.scale;

    // Controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Basket
    this.basket = this.physics.add.sprite(width / 2, height - 60, 'basket');
    this.basket.setCollideWorldBounds(true);
    this.basket.setImmovable(true);

    // Food Group
    this.foodGroup = this.physics.add.group();

    // Collision
    this.physics.add.overlap(this.basket, this.foodGroup, this.collectFood, undefined, this);

    // Mouse control
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isRunning) {
        this.basket.x = Phaser.Math.Clamp(pointer.x, this.basket.width / 2, width - this.basket.width / 2);
      }
    });
  }

  startGame() {
    this.score = 0;
    this.lives = 3;
    this.isRunning = true;
    this.foodGroup.clear(true, true);
    
    this.game.events.emit('score-changed', this.score);
    this.game.events.emit('lives-changed', this.lives);

    if (this.spawnTimer) this.spawnTimer.destroy();
    
    this.spawnTimer = this.time.addEvent({
      delay: 1000,
      callback: this.spawnFood,
      callbackScope: this,
      loop: true
    });
  }

  stopGame() {
    this.isRunning = false;
    if (this.spawnTimer) this.spawnTimer.destroy();
    this.foodGroup.setVelocityY(0);
  }

  spawnFood() {
    if (!this.isRunning) return;

    const x = Phaser.Math.Between(30, (this.scale.width as number) - 30);
    const food = this.foodGroup.create(x, -20, 'food');
    
    const speed = Phaser.Math.Between(200, 400) + (this.score * 5); // Increase speed with score
    food.setVelocityY(speed);
    food.setCircle(15);
  }

  collectFood(basket: any, food: any) {
    food.destroy();
    this.score += 1;
    this.game.events.emit('score-changed', this.score);
    soundManager.playSFX('catch');

    // Visual feedback
    this.tweens.add({
      targets: this.basket,
      scaleX: 1.2,
      scaleY: 0.8,
      duration: 50,
      yoyo: true
    });

    // Speed up spawning slightly
    if (this.score % 5 === 0 && this.spawnTimer) {
      this.spawnTimer.delay = Math.max(300, this.spawnTimer.delay - 50);
    }
  }

  update() {
    if (!this.isRunning) return;

    // Keyboard movement
    if (this.cursors.left.isDown) {
      this.basket.x -= 10;
    } else if (this.cursors.right.isDown) {
      this.basket.x += 10;
    }

    // Check for missed food
    this.foodGroup.children.entries.forEach((child: any) => {
      if (child.y > this.scale.height) {
        child.destroy();
        this.handleMiss();
      }
    });
  }

  handleMiss() {
    this.lives -= 1;
    this.game.events.emit('lives-changed', this.lives);
    soundManager.playSFX('miss');

    // Camera shake
    this.cameras.main.shake(150, 0.01);

    if (this.lives <= 0) {
      this.stopGame();
      this.game.events.emit('game-over', this.score);
    }
  }
}