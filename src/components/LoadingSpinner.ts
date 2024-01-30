import { Sprite } from "@pixi/sprite"
import { colors } from "../config/colors";
import i18n from "../config/i18n"
import { Layout } from '@pixi/layout';

/** Layout based component for the loading spinner. */
export class LoadingSpinner extends Layout {
    constructor() {

        const spinnerSprite = Sprite.from('spinner');
        spinnerSprite.anchor.set(0.5);

        super({
            id: 'LoadingSpinner',
            content: {
                spinner: {
                    content: spinnerSprite,
                    styles: {
                        marginLeft: spinnerSprite.width / 2,
                        marginTop: spinnerSprite.height / 2,
                        marginRight: -spinnerSprite.width / 2,
                    }
                },
                loadingText: {
                    content: i18n.loadingScreen.loading,
                    styles: {
                        position: 'center',
                        color: colors.text,
                        marginTop: 100,
                    }
                }
            },
            styles: {
                position: 'center',
                maxHeight: '50%',
                maxWidth: '60%',
            }
        });
    }
}