//it is needed for the interactions to work
import '@pixi/events';
import { Application } from '@pixi/app';
import { initAssets } from './config/assets';
import { game } from './Game';
import { GameScreen } from './screens/GameScreen';
import { LoadScreen } from './screens/LoadScreen';
import { colors } from './config/colors';
import { backgroundSound, playSound } from './utils/Sounds';

export const app = new Application<HTMLCanvasElement>({
    autoDensity: true,
    backgroundColor: colors.bg,
});

//debug the pixi app layers
(globalThis as any).__PIXI_APP__ = app;

function resize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
    app.renderer.view.style.width = `${windowWidth}px`;
    app.renderer.view.style.height = `${windowHeight}px`;
    window.scrollTo(0, 0);

    // Resize the renderer
    app.renderer.resize(windowWidth, windowHeight);
    // Resize the game and all scenes and their contents 
    game.resize(windowWidth, windowHeight);
}

/** Setup app and initialize assets */
async function init() {
    document.body.appendChild(app.view);
    window.addEventListener('resize', resize);
    resize(); 

    //loading assets in background
    await initAssets();

    //play background sound
    playSound(backgroundSound);

    // Set the load screen
    game.setLoadScreen(LoadScreen);
    await game.showScreen(GameScreen);
}

window.onload = init;