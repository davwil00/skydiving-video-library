import { readFile, writeFile } from 'node:fs/promises';

const mapping = {
    P: 'OC',
    IF: 'P',
    OF: 'OR',
    IC: 'OF',
    OC: 'IR',
    OR: 'T',
    T: 'IC',
    IR: 'IF',
};
const classMap: Record<string, string> = {
    IF: 'ff00ff',
    OF: '808080',
    IC: '0000ff',
    OC: 'ff0000',
    IR: '00ff00',
    OR: 'ff6600',
    T: 'ffff00',
    P: 'ffffff',
};

export async function remap(svgFileName: string): Promise<void> {
    let content = await readFile(svgFileName, 'utf8');
    const slots = Object.keys(mapping);
    slots.forEach((slot) => {
        content = content.replaceAll(`class="${slot}"`, `class="${slot}T"`);
        content = content.replaceAll(
            `fill:#${classMap[slot]}`,
            `fill:#${classMap[slot]}0`,
        );
    });
    Object.entries(mapping).forEach(([oldSlot, newSlot]) => {
        content = content.replaceAll(
            `class="${oldSlot}T"`,
            `class="${newSlot}"`,
        );
        content = content.replaceAll(
            `fill:#${classMap[oldSlot]}0`,
            `fill:#${classMap[newSlot]}`,
        );
    });

    await writeFile(
        `${svgFileName.replace('.svg', '-remapped.svg')}`,
        content,
        'utf8',
    );
}

export async function transformSvgFiles(filename: string): Promise<void> {
    await remap(filename);
}

await transformSvgFiles('public/images/8-way/blocks/15.svg');
