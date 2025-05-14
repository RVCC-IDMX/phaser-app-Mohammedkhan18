

// Import Phaser and scenes
import Phaser from 'phaser';
import TitleScene from './scenes/TitleScene.js';
import Gameplay from './scenes/Gameplay.js';

// Define the global story object (only once)
window.story = {
  start: {
    text: 'You wake up in a dark forest.' +
    'Two paths lie before you.' +
    'One leads to a sunny glade, the other into deeper darkness.',
    options: [
      { text: 'Take the sunny path', next: 'glade' },
      { text: 'Head into the darkness', next: 'darkForest' }
    ]
  },
  glade: {
    text: 'You arrive at a sunny glade with a peaceful pond.' +
    'There\'s a boat and a path going around the pond.',
    options: [
      { text: 'Take the boat', next: 'lakeMonster' },
      { text: 'Walk around the pond', next: 'cabin' }
    ]
  },
  darkForest: {
    text: 'The darkness grows. You hear wolves howling. There\'s a cave and a narrow trail.',
    options: [
      { text: 'Enter the cave', next: 'bats' },
      { text: 'Follow the trail', next: 'cliff' }
    ]
  },
  lakeMonster: {
    text: 'A lake monster emerges and capsizes your boat. Game Over.',
    options: [
      { text: 'Restart', next: 'start' }
    ]
  },
  cabin: {
    text: 'You find a cozy cabin and shelter for the night. You\'ve survived. The End.',
    options: [
      { text: 'Play Again', next: 'start' }
    ]
  },
  bats: {
    text: 'A swarm of bats chases you out. You run and fall into a pit. Game Over.',
    options: [
      { text: 'Restart', next: 'start' }
    ]
  },
  cliff: {
    text: 'The trail leads to a cliff with a bridge. It looks shaky.',
    options: [
      { text: 'Cross the bridge', next: 'escape' },
      { text: 'Turn back', next: 'bats' }
    ]
  },
  escape: {
    text: 'You carefully cross and find a road. You\'re free! The End.',
    options: [
      { text: 'Play Again', next: 'start' }
    ]
  }
};

// Phaser game configuration
const config = {
  parent: 'game-container',
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#048ABF',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [TitleScene, Gameplay]
};

// Create and export the Phaser game instance
const game = new Phaser.Game(config);




// Handle the instruction toggle button in the UI
document.getElementById('toggle-instructions').addEventListener('click', () => {
  const instructions = document.getElementById('instructions');
  const button = document.getElementById('toggle-instructions');

  if (instructions.style.display === 'none' || instructions.classList.contains('hidden')) {
    instructions.style.display = 'block';
    instructions.classList.remove('hidden');
    button.textContent = 'Hide Instructions';
  } else {
    instructions.classList.add('hidden');
    setTimeout(() => {
      instructions.style.display = 'none';
    }, 300);
    button.textContent = 'Show Instructions';
  }
});
