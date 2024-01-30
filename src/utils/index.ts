import * as PIXI from 'pixi.js';
import { FINISHED, STARTED, STOPING, WIN, setSpinState } from "./GameStateService";
import { findWinningPositions } from "./WinnerChecking";
import { WinnerComboAnimation, clearWinInterval } from "./Animations";
import { spinSound, winSound } from "./Sounds";
import player from "./Player";
import { Reel } from "../config/types";

type TweenType = {
    object: Reel,
    property: 'container' | 'symbols' | "position" | "previousPosition" | "blur",
    target: number,
    time: number,
    easing: (t: number) => number,
    onchange: (() => void) | null,
    oncomplete: (() => void) | null
}

type TweenTypeDate = TweenType & {
    propertyBeginValue: any ,
    start: number
}

const tweening: TweenTypeDate[] = [];

export function startSpin(reels: Reel[]) {
    // on start spin clear combo winning animations and stop winning sound
    clearWinInterval();
    winSound.stop();

    setSpinState(STARTED)
    for (let i = 0; i < reels.length; i++) {
        const target = reels[i].position + 10 + i * 5 + 300;
        const time = 1000 + i * 600;

        tweenTo(
            reels[i],
            'position',
            target,
            time,
            backout(0.2),
            null,
            i === reels.length - 1 ? () => reelsSpinComplete(reels) : null
        );
    }
}

export function stopSpin(reels: Reel[]) {
    setSpinState(STOPING);

    // get previous tweening 
    const prevTweening = [...tweening]

    // clear tweening 
    tweening.length = 0;

    // number of removed reels
    const removedReelsNumber = reels.length - prevTweening.length;

    for (let i = removedReelsNumber; i < reels.length; i++) {
        const target = Math.trunc(prevTweening[i - (removedReelsNumber)].target);

        tweenTo(
            reels[i],
            'position',
            target,
            i * 200,
            backout(0.2),
            null,
            i === reels.length - 1 ? () => reelsSpinComplete(reels) : null
        );
    }
}

function reelsSpinComplete(reels: Reel[]) {
    spinSound.stop()
    const winningPositions = findWinningPositions(reels);

    if (winningPositions.length > 0) {
        // calculate win amount
        player.winningPrize(player.getBet() * Math.pow(2.5, winningPositions.length));

        WinnerComboAnimation(winningPositions);
        setSpinState(WIN)
    } else {
        setSpinState(FINISHED)
    }
}

function tweenTo(object: TweenType['object'], property: TweenType['property'], target: TweenType['target'], time: TweenType['time'], easing: TweenType['easing'], onchange: TweenType['onchange'], oncomplete: TweenType['oncomplete']): TweenTypeDate {

    const tween: TweenTypeDate = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        onchange: onchange,
        oncomplete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);

    return tween;
}

export function spin() {
    const now = Date.now();
    const remove: TweenTypeDate[] = [];

    tweening.forEach(element => {
        const phase = Math.min(1, (now - element.start) / element.time);

        if (element.property === 'position' && typeof element.propertyBeginValue === 'number') {
            element.object[element.property] = lerp(element.propertyBeginValue, element.target, element.easing(phase));
        }

        if (element.onchange) {
            element.onchange();
        }

        if (phase === 1) {
            if (element.property === 'position' || element.property === 'previousPosition') {
                element.object[element.property] = element.target;
            }

            if (element.oncomplete) {
                element.oncomplete();
            }

            remove.push(element);
        }
    });

    remove.forEach(element => {
        tweening.splice(tweening.indexOf(element), 1);
    });
}

function lerp(a1: number, a2: number, t: number) {
    return a1 * (1 - t) + a2 * t;
}

function backout(amount: number) {
    return (t: number) => (--t * t * ((amount + 1) * t + amount) + 1);
}

export function addReelsAssets() : Promise<void> {
    return new Promise<void>((resolve) => {
        PIXI.Assets.load('atlasData.json').then((data) => {
            resolve(data);
        });
    });
}