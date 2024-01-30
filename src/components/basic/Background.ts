import { Sprite } from '@pixi/sprite';
import { Layout } from '@pixi/layout';

// Layout based component for the background.
export class Background extends Layout {
    constructor() {
        super({
            id: 'gameBackground',
            content: {
                bg: { 
                    content: Sprite.from('bg'),
                    styles: {
                        position: 'center',
                        maxHeight: '100%',
                        minWidth: '100%',
                    }
                },
            },
            styles: {
                width: '100%',
                height: '100%',
            }
        });
    }
}