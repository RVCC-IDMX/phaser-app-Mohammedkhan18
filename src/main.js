// Phaser 3 Choose Your Own Adventure Game
import Phaser from 'phaser';
import TitleScene from './scenes/TitleScene.js';
import Gameplay from './scenes/Gameplay.js';

const story = {
  start: {
    text: "You wake up in a dark forest. Two paths lie before you, One leads to a sunny glade, the other into deeper darkness."
        options: [
            { text: "Take the sunny path", next: "glade" },
            { text: "Head into the darkness", next: "dark_forest" }
        ]
    },
    glade: {
        text: "You arrive at a sunny glade with a peaceful pond. There's a boat and a path going around the pond.",
        options: [
            { text: "Take the boat", next: "lake_monster" },
            { text: "Walk around the pond", next: "cabin" }
        ]
    },
    dark_forest: {
        text: "The darkness grows. You hear wolves howling. There's a cave and a narrow trail.",
        options: [
            { text: "Enter the cave", next: "bats" },
            { text: "Follow the trail", next: "cliff" }
        ]
    },
    lake_monster: {
        text: "A lake monster emerges and capsizes your boat. Game Over.",
        options: [
            { text: "Restart", next: "start" }
        ]
    },
    cabin: {
        text: "You find a cozy cabin and shelter for the night. You've survived. The End.",
        options: [
            { text: "Play Again", next: "start" }
        ]
    },
    bats: {
        text: "A swarm of bats chases you out. You run and fall into a pit. Game Over.",
        options: [
            { text: "Restart", next: "start" }
        ]
    },
    cliff: {
        text: "The trail leads to a cliff with a bridge. It looks shaky.",
        options: [
            { text: "Cross the bridge", next: "escape" },
            { text: "Turn back", next: "bats" }
        ]
    },
    escape: {
        text: "You carefully cross and find a road. You're free! The End.",
        options: [
            { text: "Play Again", next: "start" }
        ]
    }
};

class AdventureScene extends Phaser.Scene {
    constructor() {
        super('adventure');
        this.currentScene = 'start';
    }

    create() {
        this.cameras.main.setBackgroundColor('#222');

        this.text = this.add.text(100, 100, '', {
            fontSize: '20px',
            color: '#fff',
            wordWrap: { width: 600 }
        });

        this.optionButtons = [];
        this.displayScene(this.currentScene);
    }

    displayScene(sceneKey) {
        this.currentScene = sceneKey;
        const scene = story[sceneKey];

        this.text.setText(scene.text);
        this.optionButtons.forEach(btn => btn.destroy());
        this.optionButtons = [];

        scene.options.forEach((option, index) => {
            const btn = this.add.text(100, 200 + index * 40, option.text, {
                fontSize: '18px',
                color: '#00f',
                backgroundColor: '#fff',
                padding: { x: 10, y: 5 }
            })
                .setInteractive()
                .on('pointerdown', () => this.displayScene(option.next));

            this.optionButtons.push(btn);
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [AdventureScene],
    backgroundColor: '#000'
};

const game = new Phaser.Game(config);
