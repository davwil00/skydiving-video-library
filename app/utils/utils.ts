import { Discipline, type Formation, isRandom, type Random } from '~/data/formations';
import { format } from 'date-fns';

export function getFormationImageUrl(formation: Formation): string {
    if (formation.discipline === Discipline.FOUR_WAY) {
        if (isRandom(formation)) {
            return getRandomImageUrl(formation);
        } else {
            return getBlockImageUrl(formation.id);
        }
    } else if (formation.discipline === Discipline.EIGHT_WAY) {
        if (isRandom(formation)) {
            return get8WayRandomImageUrl(formation);
        } else {
            return get8WayBlockImageUrl(formation.id);
        }
    } else throw new Error('Unknown discipline');
}

export function getRandomImageUrl(random: Random) {
    return `/images/randoms/${random.id}-${random.name.replace(' ', '-')}.png`.toLowerCase();
}

export function getBlockImageUrl(blockId: string): string {
    return `/images/blocks/${blockId}.png`;
}

export function get8WayRandomImageUrl(random: Random) {
    return `/images/8-way/randoms/${random.id}.png`;
}

export function get8WayBlockImageUrl(blockId: string): string {
    return `/images/8-way/blocks/${blockId}.png`;
}

export function capitalise(string: string): string {
    return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
}

export function isRandomFormation(formationId: string) {
    return /[A-Q]/.test(formationId)
}

export function calculateScoresPerRound(formationIds: string[]): number {
    return formationIds.reduce((acc, formationId) => isRandomFormation(formationId) ? acc + 1 : acc + 2, 0);
}

// From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#answer-25984542
export function shuffle<T>(a: T[], b?: number, c?: number, d?: T) {
    c = a.length;
    while (c) {
        b = Math.random() * (--c + 1) | 0;
        d = a[c];
        a[c] = a[b];
        a[b] = d;
    }
}

export function formatDate(date: Date | null): string {
    if (!date) {
        return 'Unknown';
    }
    try {
        return format(new Date(date), 'dd-MM-yyyy');
    } catch (error) {
        return '';
    }
}
