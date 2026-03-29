import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const pathTagRegex = /<path\b[\s\S]*?\/?\s*>/gi;
const styleAttributeRegex = /\bstyle=(['"])(.*?)\1/i;

async function listSvgFilesInCurrentDirectory() {
    const directoryEntries = await readdir(currentDirectory, {withFileTypes: true});

    return directoryEntries
        .filter((directoryEntry) => directoryEntry.isFile())
        .map((directoryEntry) => directoryEntry.name)
        .filter((fileName) => path.extname(fileName).toLowerCase() === '.svg')
        .sort((leftFileName, rightFileName) => leftFileName.localeCompare(rightFileName));
}

const classMap = {
    "ff00ff": "IF",
    "808080": "OF",
    "0000ff": "IC",
    "ff0000": "OC",
    "00ff00": "IR",
    "ff6600": "OR",
    "ffff00": "T",
    "ffffff": "P",
}

export async function transformSvgFile(svgFileName: string): Promise<void> {
    let content = await readFile(svgFileName, 'utf8');
    Object.entries(classMap).forEach(([colour, className]) => {
        const styleStartsWithColourRegex = new RegExp(
            `^\\s*fill:#${colour}(?:\\s*;|$)`,
            'i',
        );
        content = content.replace(pathTagRegex, (tag) => {
            const styleMatch = tag.match(styleAttributeRegex);

            if (!styleMatch || !styleStartsWithColourRegex.test(styleMatch[2])) {
                return tag;
            }

            if (tag.includes(`class=${className}`)) {
                return
            }

            return tag.replace("/>", `class="${className}" />`);
        });
    });

    await writeFile(`${svgFileName}`, content, 'utf8');
}

export async function transformSvgFiles(
    svgFileNames?: readonly string[],
): Promise<void> {
    const resolvedSvgFileNames = svgFileNames?.length
        ? svgFileNames
        : await listSvgFilesInCurrentDirectory();

    for (const svgFileName of resolvedSvgFileNames) {
        await transformSvgFile(svgFileName);
    }
}

transformSvgFiles()

