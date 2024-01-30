import { BaseScreen } from '../components/basic/BaseScreen';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { colors } from '../config/colors';
import { Layout } from '@pixi/layout';

// Load screen to be used to show loading animation while assets are being loaded
export class LoadScreen extends BaseScreen {
    public static assetBundles = ['preload'];
    
    constructor() {
        super('LoadScreen');

        this.addContent({
            spinnerLayout: new LoadingSpinner(),
        });

        this.setStyles({
            background: colors.bg,
        });
    }

    public onUpdate() {
        const spinner = this.getChildByID('spinner');
        
        if (spinner && spinner instanceof Layout) { 
            const spinnerSprite = spinner.content.firstChild;
            spinnerSprite.rotation += 0.05; // rotate the spinner sprite
        }
    }
}
