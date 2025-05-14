// Import Phaser
import Phaser from 'phaser';

/* The TitleScene class defines the initial scene where the player sees the game title
and instructions to start */
export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('title'); // Set the unique key for this scene
  }

  // Preload game assets: background logo and button click sound
  preload() {
    // Logo image for branding and aesthetic
    this.load.image('logo', 'assets/images/logo.png');

    // Click sound for feedback on interaction
    this.load.audio('click', './assets/click.mp3');
  }

  create() {
    // Create and store the click sound instance
    const clickSound = this.sound.add('click');

    // Game title text
    this.add.text(190, 100, 'Into the Forest', {
      fontSize: '48px',
      color: '#011526'
    });

    // Subtitle text
    this.add.text(180, 200, 'A Choose Your Own Adventure Game', {
      fontSize: '24px',
      color: '#011526'
    });

    // Start prompt - interactive to allow clicking as well as keyboard input
    this.add.text(290, 300, 'Press SPACE to Start', {
      fontSize: '18px',
      color: '#021E73'
    }).setInteractive().on('pointerdown', () => {
      clickSound.play(); // Audio feedback
      this.startGame();  // Begin the game
    });

    // Enable spacebar to start the game as well
    this.input.keyboard.on('keydown-SPACE', () => {
      clickSound.play();
      this.startGame();
    });

    // Add logo at the bottom and scale it to 10% of original size
    this.add.image(400, 480, 'logo').setScale(0.1);


    // Setup Show/Hide Instructions toggle
    const instructions = document.getElementById('instructions');
    const toggleBtn = document.getElementById('toggle-instructions');

    if (toggleBtn && instructions) {
      toggleBtn.addEventListener('click', () => {
        clickSound.play();

        const isHidden = instructions.classList.toggle('hidden');

        // Change button text based on visibility
        toggleBtn.textContent = isHidden ? 'Show Instructions' : 'Hide Instructions';

        // Optional: Add animation
        instructions.style.display = isHidden ? 'none' : 'block';
      });

      // Ensure initial text matches visibility
      toggleBtn.textContent = instructions.classList.contains
      ('hidden') ? 'Show Instructions' : 'Hide Instructions';
    }


  }

  // Starts the gameplay scene and hides instructions overlay
  startGame() {
    const instructions = document.getElementById('instructions');

    if (instructions) {
      instructions.classList.add('hidden');
      setTimeout(() => {
        instructions.style.display = 'none';
        this.scene.start('gameplay');
      }, 300); // Match with the CSS transition time
    } else {
      this.scene.start('gameplay');
    }
  }
}
