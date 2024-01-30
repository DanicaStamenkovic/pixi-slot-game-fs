
import gsap from 'gsap';
import { Layout, Styles } from '@pixi/layout';

export class BaseScreen extends Layout {
    constructor(id: string, styles?: Styles) {
        super({
            id,
            styles: {
                width: '100%',
                height: '100%',
                color: 'white',
                ...styles,
            }
        });
    }

    public onUpdate(_delta: number) {
        /* Override this method to update the screen */
    };

    public resize(_w: number, _h: number) {
        super.resize(_w, _h);
    };

    public async show() {
        gsap.killTweensOf(this);
        this.alpha = 0;
        await gsap.to(this, { alpha: 1, duration: 0.2, ease: 'linear' }); // fade in
    }


    public async hide() {
        gsap.killTweensOf(this);
        await gsap.to(this, { alpha: 0, duration: 0.2, ease: 'linear' }); // fade out
    }
}
