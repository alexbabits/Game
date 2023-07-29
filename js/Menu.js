export default class Menu extends Phaser.Scene{

    constructor(){
        super("Menu");
    }

    create(data) {
        this.gameState = data.gameState;
        this.menuBackground = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'bag').setScale(2.0, 4.0);
        this.createButtons();
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.resume(this.gameState.getCurrentMap());
            this.scene.resume('InventoryDisplay');
            this.scene.resume('EquipmentDisplay');
        });
    }

    createButtons() {
        const labels = ['Resume', 'Controls', 'Save', 'Load', 'Quit'];
        const height = this.game.config.height
        const yPos = [height / 2 - 100, height / 2 - 50, height / 2, height / 2 + 50, height / 2 + 100];
        const xPos = this.game.config.width / 2;
    
        labels.forEach((label, index) => {
            let buttonClickedMethod;
            const y = yPos[index];   
            const buttonSprite = this.add.sprite(xPos, y, 'items', 11).setScale(3.0, 1).setInteractive();
            buttonSprite.on('pointerover', () => {buttonSprite.setTint(0x9e733f);});
            buttonSprite.on('pointerout', () => {buttonSprite.clearTint();});
    
            if (label === 'Resume') { buttonClickedMethod = this.resumeButtonClicked.bind(this); }
            else if (label === 'Controls') { buttonClickedMethod = this.controlsButtonClicked.bind(this); }
            else if (label === 'Save') { buttonClickedMethod = this.saveButtonClicked.bind(this); }
            else if (label === 'Load') { buttonClickedMethod = this.loadButtonClicked.bind(this); }
            else if (label === 'Quit') { buttonClickedMethod = this.quitButtonClicked.bind(this); }
    
            buttonSprite.on('pointerdown', buttonClickedMethod);
    
            const buttonText = this.add.text(xPos, y, label, { fontSize: '16px', fontFamily: 'Arial', fill: '#000', resolution: 4 }).setOrigin(0.5, 0.5);
            this.add.container(0, 0, [buttonSprite, buttonText]);
        });
    }
    
    resumeButtonClicked() {
        this.scene.stop();
        this.scene.resume(this.gameState.getCurrentMap());
        this.scene.resume('InventoryDisplay');
        this.scene.resume('EquipmentDisplay');
    }

    controlsButtonClicked() {
        this.scene.start('ControlsScene', { returnScene: this.scene.key });
    }

    async saveButtonClicked() {
        console.log('Save button pressed');
        
        let player = this.gameState.player;
        let inventory = this.gameState.inventory;
        let equipment = this.gameState.equipment;
    
        this.gameState.savePlayerState(player);
        this.gameState.saveInventoryState(inventory);
        this.gameState.saveEquipmentState(equipment);
        await this.gameState.saveToFile();
        
        console.log('Game Saved');
    }
    
    async loadButtonClicked() {
        this.scene.stop();
        this.scene.start('LoadScene', { returnScene: this.scene.key });
    }

    quitButtonClicked() {
        for (let key in this.scene.manager.scenes) {
            if (key !== 'StartScreen') {
                this.scene.manager.scenes[key].scene.stop();
            }
        }
        this.scene.start('StartScreen')
    }
}