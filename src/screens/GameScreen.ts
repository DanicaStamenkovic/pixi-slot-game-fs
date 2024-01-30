import { BaseScreen } from '../components/basic/BaseScreen';
import { game } from '../Game';
import { colors } from '../config/colors';
import { Sprite } from '@pixi/sprite';
import { Container, DisplayObject } from '@pixi/display';
import { Bet } from '../components/informations/Bet';
import { Credit } from '../components/informations/Credit';
import { ActionButtonProps, Reel } from '../config/types';
import player from '../utils/Player';
import { ActionButton } from '../components/ActionButton';
import { Reels } from '../components/Reels';
import { app } from '../main';
import { addReelsAssets, spin, startSpin, stopSpin } from '../utils';
import { animateSymbolsTickerCallback } from '../utils/Animations';
import { ToggleSound } from '../components/ToggleSound';
import { Spinner } from '../components/Spinner';

//Game screen to be used to show all the game play and UI
export class GameScreen extends BaseScreen {
    public static assetBundles = ['game'];

    private bet: Container<DisplayObject>;
    private credit: Container<DisplayObject>;
    private soundContainer: Container<DisplayObject>
    private gameBorder: Sprite;
    public reels: Reel[] = [];
    public containerReels!: any;
    private assets: any;
    private windowWidth: number;

    constructor() {
        super('GameScreen');

        game.addBG();

        this.bet = Bet();
        this.credit = new Credit().creditTab;
        this.soundContainer = ToggleSound();
        this.gameBorder = Sprite.from('GameBorder');
        this.windowWidth = Sprite.from('Window').width;

        this.addInformations();
        this.initContainer()
    }

    private async initContainer() {
        this.assets = await addReelsAssets();
        this.createGame();
    }

    private addInformations() {
        this.addContent({
            content: {
                bet: {
                    content: this.bet,
                    styles: {} 
                },
                soundContainer: {
                    content: this.soundContainer,
                    styles: {
                        position: 'center',
                    }
                },
                credit: {
                    content: this.credit,
                    styles: {
                        position: 'right'
                    }
                },
            },
            styles: {
                position: 'centerBottom',
                marginBottom: -5,
                maxWidth: '85%', 
                width: '100%',
                background: colors.infoBG,
                borderRadius: 15,
            }
        });
    }

    private createGame() {
        this.createFromAssets();
    
        const actionButtonProps: ActionButtonProps = {
            onStartSpin: () => {
                // update credit 
                player.updateCredit();
                startSpin(this.reels)
            },
            onStopSpin: () => stopSpin(this.reels),
        };

        this.addContent({
            content: {
                spinner:{
                    content: new Spinner(this.windowWidth, Sprite.from('Window').height).spinner,
                    styles: {
                        position: 'top'
                    }
                },
                border: {
                    content: this.gameBorder,
                    styles: {
                        maxWidth: '100%',
                        maxHeight: '100%',
                        position: 'center',
                        scale: 1.2
                    }
                },
                symbols: {
                    content: this.containerReels.reelContainer,
                    styles: {
                        position: 'center',
                    }
                },
                button: {
                    content: ActionButton(actionButtonProps),
                    styles: {
                        position: 'centerBottom',
                        marginBottom: -5
                    }
                } 
            },
            styles: {
                background: Sprite.from('Window'),
                maxWidth: '80%', 
                maxHeight: '100%',
                marginTop: -30,
                marginBottom: 350,
                position: 'center',
                overflow: 'hidden'
            }
        })
    }

    private createFromAssets() {
        const showReels = new Reels(
            this.assets,
            this.reels,
            this.windowWidth,
        );
        this.containerReels = showReels
        
        app.ticker.add((delta) => {
            showReels.updateReels(delta);
            spin();
            animateSymbolsTickerCallback();
        });
    }
}
