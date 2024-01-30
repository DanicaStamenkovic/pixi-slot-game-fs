import { isSpinFinished, isSpinRunning, onGameWin, onSpinFinished, onSpinStart, onSpinStoping } from '../utils/GameStateService';
import { actionButtonStyle } from '../config/styles';
import { ActionButtonProps } from '../config/types';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { Text } from '@pixi/text';

export function ActionButton(props: ActionButtonProps) {
  const button = new Container();
  const buttonSprite: Sprite = Sprite.from('PlayButton')
  buttonSprite.width = 200;
  buttonSprite.height= 100;

  const buttonText:Text = new Text('Start', actionButtonStyle );
    buttonText.anchor.set(0.5);
    buttonText.position.set(
        buttonSprite.x + buttonSprite.width / 2,
        buttonSprite.y + buttonSprite.height / 2
    );
  
    buttonSprite.eventMode = 'static';
    buttonSprite.cursor = 'pointer';
  
    onSpinFinished(() => {
      buttonText.text = 'Start';
      buttonSprite.cursor  = 'pointer';
    });

    onSpinStart(() => {
      buttonText.text = 'Stop';
    })

    onGameWin(() => {
      buttonText.text = 'WIN!';
      buttonSprite.cursor  = 'progress';
    })

    onSpinStoping(() => {
      buttonSprite.cursor  = 'progress';
    })

    buttonSprite.addListener('pointerdown', () => {
      if(isSpinRunning()) {
        props.onStopSpin();
      } else if(isSpinFinished()) {
        props.onStartSpin();
      }
    });

    button.addChild(buttonSprite, buttonText)
    return button;    
}

