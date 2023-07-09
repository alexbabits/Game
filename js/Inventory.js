import UserInput from './UserInput.js';

    const slotSize = 32;
    const slotsPerRow = 4;
    const slotsPerColumn = 4;
    const slotSpacing = 5;
    const startX = 418;
    const startY = 418;

export default class Inventory {

    static preload(scene){
        scene.load.spritesheet('items','assets/images/items.png',{frameWidth:32,frameHeight:32});
        scene.load.image('bag','assets/images/bagbackground.png');
    }

    constructor(scene, gameState){
        this.scene = scene;
        this.gameState = gameState;
        this.userInput = new UserInput(this.scene);
        this.inventoryData = this.gameState.inventoryData;
        this.inventoryVisibility = this.gameState.getInventoryVisibility();
    };

    getInventoryData() {return this.inventoryData}
    setInventoryData(inventoryData) {this.inventoryData = inventoryData}   

    drawInventorySlots(scene) {
        const width = scene.game.config.width;
        const height = scene.game.config.height;
        const startX = width - 222
        const startY = height - 222
        this.bagBackground = scene.add.image(475, 475, 'bag');
        this.bagBackground.setDepth(420).setScale(1.9125).setScrollFactor(0, 0);
        this.bagBackground.setVisible(this.inventoryVisibility);
        this.slotSprites = [];
      
        for (let i = 0; i < slotsPerRow; i++) {
          this.slotSprites[i] = [];
          for (let j = 0; j < slotsPerColumn; j++) {
            let x = startX + i * (slotSize + slotSpacing);
            let y = startY + j * (slotSize + slotSpacing);
      
            let slotSprite = scene.add.sprite(x, y, 'items', 11);
            slotSprite.setDepth(456).setScale(1).setScrollFactor(0, 0).setInteractive();
            slotSprite.setVisible(this.inventoryVisibility);

            slotSprite.slotID = j * slotsPerRow + i + 1;
            slotSprite.on('pointerover', function (pointer) {
              console.log(`Hovering over slotID: ${this.slotID}`);
              this.setTint(0xFFFF00);
            });
            slotSprite.on('pointerout', function (pointer) {
              console.log(`Left slotID: ${this.slotID}`);
              this.clearTint();
            });

            this.slotSprites[i][j] = slotSprite;
          }
        }
      }

      drawInventoryItems(scene) {
        this.itemSprites = [];
        this.itemTexts = [];
        
        for (let i = 0; i < slotsPerRow; i++) {
          this.itemSprites[i] = [];
          this.itemTexts[i] = []; 
          for (let j = 0; j < slotsPerColumn; j++) {
            let x = startX + i * (slotSize + slotSpacing);
            let y = startY + j * (slotSize + slotSpacing);
        
            let itemData = this.inventoryData[i][j];
            if (itemData) {
              let itemSprite = scene.add.sprite(x-2, y-2, 'items', itemData.frame);
              itemSprite.setDepth(457).setScale(0.9).setScrollFactor(0, 0).setInteractive();
              itemSprite.setVisible(this.inventoryVisibility);
              this.itemSprites[i][j] = itemSprite;
      
              let quantityText = scene.add.text(x+5, y, itemData.quantity, { fontSize: '12px', fontFamily: 'Arial', fill: '#000', resolution: 4 });
              quantityText.setDepth(458).setScrollFactor(0, 0);  
              quantityText.setVisible(this.inventoryVisibility);
              this.itemTexts[i][j] = quantityText;
            } else {
              this.itemSprites[i][j] = null;
              this.itemTexts[i][j] = null;
            }
          }
        }
      }


      getInventoryVisibility() {return this.inventoryVisibility}
      setInventoryVisibility(visible) {
          this.inventoryVisibility = visible;
          this.gameState.setInventoryVisibility(this.inventoryVisibility);
      }
      
      toggleInventoryVisibility() {
        this.setInventoryVisibility(!this.getInventoryVisibility());
        
        for (let row of this.slotSprites) {
            for (let slotSprite of row) {
                slotSprite.setVisible(this.inventoryVisibility);
            }
        }
    
        for (let row of this.itemSprites) {
            for (let itemSprite of row) {
                if (itemSprite) {
                    itemSprite.setVisible(this.inventoryVisibility);
                }
            }
        }
    
        for (let row of this.itemTexts) {
            for (let itemText of row) {
                if (itemText) {
                    itemText.setVisible(this.inventoryVisibility);
                }
            }
        }
        this.bagBackground.setVisible(this.inventoryVisibility);
    }

      update() {
        if (Phaser.Input.Keyboard.JustDown(this.userInput.cursors.I)) {
            this.toggleInventoryVisibility();
        }
    }
    

    //adds an item and it's sprite to the first available inventory slot. Also considers the quantity added. If it's adding another of the same item, add it to the same slot, don't redraw the sprite, and increment a counter text which displays the quantity.
    //If all slots are full such that the item cannot be added, the item is not added. return.
    //Should update the contents array/object in some way.

    moveItem() {
        //Handles logic for actually dragging the item sprite around. 
        //Makes it so if the drag stops, the item 'snaps' back to the slot it was in.
        //Move an item from Slot A to Slot B. Also handles if an item is already in that slot, and things like that.
    };

    addItem(itemName, frame, quantity) {
        //pass in an itemName, frame, and quantity, and it puts the item in the inventory in a slot.
        this.drawInventoryItems();
    }

    removeItem(/*itemName or frame, quantity, slotNumber*/){
        //Removes a specified item. Also considers the quantity removed.
        //Should update the contents array/object in some way.
    };



    destroyInventory(){
        //Completely destroys the inventory, it's sprites, and it's data. I suppose invoked during scene transitions? After the inventory has been saved to the gamestate, it makes sure everything is clear, so when a new scene appears, the loadInventoryState can be invoked with no issues?
    };

    //Future include: Clicking 'X' exit button in inventory to close inventory, or a small bag icon to open inventory. 
}

/* Notes 

Which methods should be in Inventory.js and which should be in GameState: Keep methods related to the functionality of the inventory (like adding and removing items, showing and hiding the inventory, etc.) in the Inventory class. Methods related to saving and loading the inventory state (like saveInventoryState and loadInventoryState) should be in the GameState class, since they're more about the overall state of the game than the specific functionality of the inventory.


The underlying data of the inventory (which items are in which slots, and their quantities) is the most important part. This is the "state" of the inventory, and it's what you'll be saving and loading when you transition between scenes.

The visual representation of the inventory (the slots, the item sprites, the quantity text, etc.) is derived from this underlying data. When you load a new scene, you'll load the saved inventory data, and then use this data to draw the inventory on the screen. This could involve creating a sprite for each item in the inventory, positioning it in the correct slot, and displaying the correct quantity.

Process:

1. Save the inventory data: When the player leaves a scene, you'll call saveInventoryState to save the current state of the inventory. This will involve getting the current inventory data (using getInventoryData) and storing it in the GameState.
2. Destroy the inventory: You'll then call destroyInventory to clear the current inventory. This will involve clearing the underlying data (setting this.contents or this.inventoryData to an empty array or object) and also removing any visual elements (the slots, item sprites, quantity text, etc.).
3. Load the new scene: You'll load the new scene.
4. Load the inventory data: You'll call loadInventoryState (Probably within the create method of the parent 'Map' class) to load the saved inventory data into the new scene. This will involve setting the inventory data (using setInventoryData) to the saved data from the GameState.
5. Draw the inventory: You'll call drawInventorySlots to draw the inventory on the screen. This will involve creating a sprite for each item in the inventory, positioning it in the correct slot, and displaying the correct quantity.


*/



/*
    //Bonus/Extra Future stuff:

    rightClickDestroy(){
        //If the player right clicks, a small hover screen can come up with the option to remove the item.
    };

    hoverOverStats(){
        // If hovered over an item, displays its name and some text about the item in a small screen.
    };
*/
