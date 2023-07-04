export class Bar {
    constructor(scene, x, y, player, width, height, textX, textY, color) {
        this.scene = scene;
        this.player = player;
        this.color = color;
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.text = new Phaser.GameObjects.Text(scene, textX, textY, '', { fontFamily: 'Courier', fontSize: '11px', fill: '#000', resolution: 2 });
        this.bar.setDepth(50);
        this.text.setDepth(51);
        this.bar.setScrollFactor(0, 0);
        this.text.setScrollFactor(0, 0);
        this.x = x;
        this.y = y;
        this.size = {width, height};
        scene.add.existing(this.bar);
        scene.add.existing(this.text);
    }

    draw(value, maxValue, textColor) {
        this.bar.clear();
        this.pixelPerValue = this.size.width / maxValue;
        this.text.setText(`${value}/${maxValue}`);

        const { width, height } = this.size;
        const valueWidth = value * this.pixelPerValue;
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRect(this.x, this.y, width, height);
        this.bar.fillStyle(this.color);

        if (valueWidth > 0) {
            this.bar.fillRect(this.x, this.y, valueWidth, height);
        }
    }
}

export class HPBar extends Bar {
    constructor(scene, x, y, player) {
        super(scene, x, y, player, 77, 10, 130, 108, 0x73e600);
    }

    draw() {
        let color = this.color;
        if (this.player.HP <= this.player.maxHP / 4) {
            color = 0xFF0000;
        }
        super.draw(this.player.HP, this.player.maxHP, color);
    }
}

export class XPBar extends Bar {
    constructor(scene, x, y, player) {
        super(scene, x, y, player, 200, 10, 420, 108, 0x7300e6);
        scene.events.on('xpChange', this.draw, this);
        scene.events.on('levelUp', this.draw, this);
    }
    draw() {super.draw(this.player.XP, this.player.maxXP, this.color)}
}

export class StaminaBar extends Bar {
    constructor(scene, x, y, player) {super(scene, x, y, player, 77, 10, 130, 123, 0xe6e600)}
    draw() {super.draw(this.player.stamina, this.player.maxStamina, this.color)}
}

export class ManaBar extends Bar {
    constructor(scene, x, y, player) {super(scene, x, y, player, 77, 10, 130, 138, 0x0073e6)}
    draw() {super.draw(this.player.mana, this.player.maxMana, this.color)}
}