import { type Formation, isRandom } from '~/data/formations';
import { Difficulty } from '~/state/quiz-reducer';

export function getFormationDisplayName(
    formation: Formation,
    difficulty?: Difficulty,
): string {
    if (isRandom(formation)) {
        return `${formation.id}${difficulty === Difficulty.EASY ? `- ${formation.name}` : ''}`;
    }

    return `${formation.id}`;
}
