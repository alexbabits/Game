/*
Handles all things associated with user input:

--> Clicking Things (Changing volume, changing options, click load/save buttons)
--> Entering Information (inputting values in options or text box prompts in game)
*/

export default class UserInput {
    constructor(scene) {
      this.scene = scene;
      this.cursors = this.scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        ctrl: Phaser.Input.Keyboard.KeyCodes.CTRL,
        esc: Phaser.Input.Keyboard.KeyCodes.ESC
      });
    }
  }