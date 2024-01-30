import * as PIXI from 'pixi.js';
import { Resource, Texture } from '@pixi/core';
import { Container } from '@pixi/display';

export function ButtonWithIcon(iconPath: string, onClick: () => void) {
    const button = new Container();
    button.eventMode = 'static';
    button.cursor = 'pointer';

    const buttonTexture: Texture<Resource> = Texture.from(iconPath);
    const icon: PIXI.Sprite = new PIXI.Sprite(buttonTexture);
    icon.width = 15;
    icon.height= 15;
    icon.anchor.set(0.5)
    button.addChild(icon)
    
    const rotateIcon = () => {
        icon.rotation += Math.PI;
    }

    button.on('pointerdown', onClick);

    return { button, rotateIcon }
}