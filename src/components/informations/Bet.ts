import { Tab } from './Tab';
import player from '../../utils/Player';
import { betTextStyle } from '../../config/styles';
import { SelectBet } from './SelectBet';
import { BetOptions } from '../../constants/Bets';
import { Container } from '@pixi/display';

export function Bet() {
    const betContainer = new Container();
    const { tab, value } = Tab('Bet',  `${player.getBet().toString()} €`, betTextStyle);

    const onSelectBet = (selectedOption:number) => {
        value.text = `${selectedOption.toString()} €`
        player.setBet(selectedOption);
    }

    const selectBet = SelectBet(BetOptions, onSelectBet);

    selectBet.position.set((betContainer.width / 2) + 25, betContainer.height /  2 + 25);

    betContainer.addChild(tab, selectBet);

    return betContainer;
}