import * as PIXI from 'pixi.js';
import { AtlasFrames, Reel } from '../config/types'; 
import { Container } from '@pixi/display';
import { Layout } from '@pixi/layout';

export class Reels extends Layout {
    private reels!: Reel[];
    private slotTextures: PIXI.Texture[] = [];
    public symbols: AtlasFrames;
    private reelContainer: Container = new Container();
    private symbolSize: number;
    private reelWidth: number;

    constructor (symbols: AtlasFrames, reels: Reel[], width: number) {
        super({id: 'Reels'})

        this.symbols = symbols;
        this.reels = reels;
        this.reelWidth = Math.floor((width * 0.8) / 4);
        this.symbolSize = 110;
        const frames = Object.keys(symbols.data.frames);

        for (const frame of frames) {
            this.slotTextures.push(PIXI.Texture.from(frame));        
        }
   
        this.initializeReels(); 
    }

    private initializeReels(): void {
        for (let i = 0; i < 4; i++) {
            const reelColumn: any = new PIXI.Container();
            reelColumn.x = i * this.reelWidth;

            const reel: Reel = {
                container: reelColumn,
                symbols: [],
                position: 0,
                previousPosition: 0,
                blur: new PIXI.BlurFilter(),
            };

            reel.blur.blurXFilter.blur = reel.blur.blurYFilter.blur = 0;
            reelColumn.filters = [reel.blur];

            for (let j = 0; j < 4; j++) {
                const symbolID = Math.floor(Math.random() * this.slotTextures.length);
                const reelSymbol = new PIXI.Sprite(this.slotTextures[symbolID]);
                reelSymbol.y = j * (this.symbolSize / 2);
                reelSymbol.scale.x = reelSymbol.scale.y = Math.min(this.symbolSize / reelSymbol.width, this.symbolSize / reelSymbol.height);
                reelSymbol.anchor.set(0.5);
                reelSymbol.x = this.symbolSize / 2;
                reelSymbol.anchor.set(0.5);
                reelSymbol.renderId = symbolID + 1;
                reel.symbols.push(reelSymbol);
                reelColumn.addChild(reelSymbol);
                this.reelContainer.addChild(reelColumn);
            }
    
            //for update
            this.reels.push(reel);
        }
    }

    public updateReels(_delta: number): void {
        this.reels.forEach(element => {
            element.blur.blurY = (element.position - element.previousPosition) * 8;
            element.previousPosition = element.position;

            element.symbols.forEach((symbol, j) => {
                const previousSymbolPosition = symbol.y;
                symbol.y = ((element.position + j) % element.symbols.length) * this.symbolSize - this.symbolSize + (this.symbolSize / 2);

                if (symbol.y < 0 && previousSymbolPosition > this.symbolSize) {
                    const symbolID = Math.floor(Math.random() * this.slotTextures.length);
                    symbol.texture = this.slotTextures[symbolID];
                    symbol.anchor.set(0.5);
                    symbol.renderId = symbolID + 1;
                }
            });
        });
    }
}