import { toggleSoundPlayback, shouldPlaySounds } from '../utils/Sounds';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { Resource, Texture } from '@pixi/core';

export function ToggleSound() {
    const soundContainer = new Container();

    const toggleSound = () => {
      updateButtonTexture()
      toggleSoundPlayback()
    };

    const soundOnTexture: Texture<Resource> = Texture.from('SoundOn');
    const soundOffTexture: Texture<Resource> = Texture.from('SoundOff');

    const toggleButton: Sprite = new Sprite(soundOnTexture);
    toggleButton.width = 20;
    toggleButton.height = 20;
    toggleButton.eventMode = 'static';
    toggleButton.cursor = 'pointer';
    toggleButton.on('pointerdown', toggleSound);
    soundContainer.addChild(toggleButton);

    const updateButtonTexture = () => {
      toggleButton.texture = !shouldPlaySounds ? soundOnTexture : soundOffTexture;
    };

    return soundContainer;
}