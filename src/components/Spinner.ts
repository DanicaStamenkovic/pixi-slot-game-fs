import { onSpinFinished, onSpinStart, onSpinStoping } from "../utils/GameStateService";
import { SPINNER_WRAPPER, SpinnerAnimation } from "../utils/Animations";
import { playSound, spinSound } from '../utils/Sounds';
import { app } from '../main';
import { Container, DisplayObject } from '@pixi/display';

export class Spinner {
    private updateSpinner;
    public spinner: Container<DisplayObject>

    constructor(spinnerWidth: number, spinnerHeight: number) {
        this.spinner = SPINNER_WRAPPER;
        this.updateSpinner = SpinnerAnimation(spinnerWidth, spinnerHeight);

        this.spinner.visible = false;

        onSpinStart(() => {
            this.spinner.visible = true;
            app.ticker.add(this.updateSpinner);
            playSound(spinSound);
        });

        onSpinStoping(() => {
            this.spinner.visible = false;
            app.ticker.remove(this.updateSpinner);
        });

        onSpinFinished(() => {
            this.spinner.visible = false;
            app.ticker.remove(this.updateSpinner);
        });
    }
}