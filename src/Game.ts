import { Assets } from '@pixi/assets';
import { areBundlesLoaded } from './config/assets';
import { app } from './main';
import { BaseScreen } from './components/basic/BaseScreen';
import { Layout } from '@pixi/layout';
import { Background } from './components/basic/Background';

// Interface for app screens constructors
interface BaseScreenConstructor {
    new (data?: any): BaseScreen;
    assetBundles?: string[];
}

// Class for controlling visibility of all scenes, 
class Game {
    private currentScreen?: BaseScreen;
    private currentScreenResize?: () => void;
    private loadScreen?: BaseScreen;

    public _w!: number;
    public _h!: number;
    public bg!: Layout;

    // Set the  default load screen
    public setLoadScreen(screen: BaseScreenConstructor) {
        this.loadScreen = new screen();
    }

    addBG () {
        this.bg = new Background();
        this.bg.resize(this._w, this._h);
        app.stage.addChild(this.bg);
    }

    /** Add screen to the stage, link update & resize functions */
    private async addScreen(screen: BaseScreen) {
        app.stage.addChild(screen);

        if (screen.resize) {
            this.currentScreenResize = () => screen.resize;
            screen.resize(this._w, this._h);
        }

        if (screen.onUpdate) { 
            app.ticker.add(screen.onUpdate, screen);
        }

        if (screen.show) {
            await screen.show();
        }
    }

    // Remove screen from the stage, remove update & resize functions 
    private async removeScreen(screen: BaseScreen) {
        if (screen.hide) {
            await screen.hide();
        }

        // remove resize handler if exists
        if (this.currentScreenResize) {
            window.removeEventListener('resize', this.currentScreenResize);
        }

        // remove update function if method is available
        if (screen.onUpdate) {
            app.ticker.remove(screen.onUpdate, screen);
        }

        // Remove screen from its parent
        if (screen.parent) {
            screen.parent.removeChild(screen);
        }
    }

    // Hide current screen and present a new screen.
    public async showScreen(screen: BaseScreenConstructor, data?: any) {
        if (this.currentScreen) {
            await this.removeScreen(this.currentScreen);
            // Destroy current screen
            this.currentScreen.destroy();
        }

        // Load assets for the new screen
        if (screen.assetBundles && !areBundlesLoaded(screen.assetBundles)) {
            if (this.loadScreen) {
                this.addScreen(this.loadScreen);
            }

            // Load all assets required by this new screen
            await Assets.loadBundle(screen.assetBundles);

            // Hide loading screen
            if (this.loadScreen) {
                this.removeScreen(this.loadScreen);
            }
        }

        this.currentScreen = new screen(data);
        await this.addScreen(this.currentScreen);
    }

    public resize(w: number, h: number) {
        this._w = w; 
        this._h = h;
        this.currentScreen?.resize?.(w, h);
        this.bg?.resize(w, h);
    }
}

export const game = new Game();
