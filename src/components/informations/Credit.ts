import player from "../../utils/Player";
import { creditTextStyle } from '../../config/styles';
import { Tab } from "./Tab";
import { Text } from '@pixi/text';
import { Container } from '@pixi/display';
import { onGameWin, onSpinStart } from '../../utils/GameStateService';

export class Credit {
    private creditValue: Text;
    public creditTab: Container;

    constructor() {
        const creditWrapper = new Container()

        const { tab, value } =  Tab('Credit', `${player.getCredit().toString()} €`, creditTextStyle);
        creditWrapper.addChild(tab)
    
        this.creditValue = value;
        this.creditTab = creditWrapper;

        onGameWin(() => {
            this.updateCreditValue()
        })

        onSpinStart(() => {
            this.updateCreditValue()
        })
    }

    private updateCreditValue() {
        this.creditValue.text = `${player.getCredit().toString()} €`;
    }
}