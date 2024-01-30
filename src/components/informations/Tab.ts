import { Graphics } from '@pixi/graphics';
import { Text, TextStyle } from '@pixi/text';

export function Tab(labelText: string, valueText: string, style: TextStyle) {
    const tab = new Graphics()
    tab.beginFill(0x610e00)
    .drawRoundedRect(0, 0, 150, 55, 15)

    const label = new Text(labelText, {...style, fontSize: 11});
    const value = new Text(valueText, {...style, fontSize: 18});
    label.position.set((tab.width - label.width) / 2, 0);
    value.position.set((tab.width - value.width) / 2, style.lineHeight);

    tab.addChild(label, value);

    return { tab, value };
}