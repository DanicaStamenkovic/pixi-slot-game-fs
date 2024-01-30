import { Container, DisplayObject } from '@pixi/display';
import * as PIXI from 'pixi.js';

export type ActionButtonProps = {
    onStartSpin: () => void;
    onStopSpin: () => void;
}  

export type Reel = {
    container: Container<DisplayObject>,
    symbols: PIXI.Sprite[],
    position: number,
    previousPosition: number,
    blur: PIXI.BlurFilter
}

export type AtlasFrames = {
    data: {
      frames: Record<string, any>;
    };
}