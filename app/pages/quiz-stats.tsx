import type { MetaFunction } from 'react-router';
import {
    getQuizFormationStatsKey,
    type QuizFormationStats,
    useSiteStateContext,
} from '~/contexts/site-state';
import type { Formation } from '~/data/formations';
import { getAllFormations, getDisplayName } from '~/data/formations';
import {SiteType} from "~/utils/site-utils";

export function getQuizStatsStorageKey(siteType: SiteType) {
    return `${QUIZ_STATS_STORAGE_KEY}:${siteType}`;
}

function loadQuizStats(siteType: SiteType): QuizStats {
    const storedQuizStats = window.localStorage.getItem(
        getQuizStatsStorageKey(siteType),
    );

    if (!storedQuizStats) {
        return {};
    }

    try {
        const parsedStats: unknown = JSON.parse(storedQuizStats);
        return isQuizStats(parsedStats) ? parsedStats : {};
    } catch (error) {
        console.error('Unable to parse quiz stats from local storage', error);
        return {};
    }
}

function saveQuizStats(siteType: SiteType, quizStats: QuizStats) {
    window.localStorage.setItem(
        getQuizStatsStorageKey(siteType),
        JSON.stringify(quizStats),
    );
}

export function recordStat(formation: Formation, isCorrect: boolean, siteType: SiteType) {
    const formationKey = getQuizFormationStatsKey(formation);
    const currentStats = loadQuizStats(siteType)
    const formationStat = currentStats[formationKey] ??
    {
        correct: 0,
        incorrect: 0,
    };

    if (isCorrect) {
        formationStat.correct = formationStat.correct + 1
    } else {
        formationStat.incorrect = formationStat.incorrect + 1
    }

    const updatedStats = {
        ...currentStats,
        [formationKey]: formationStat
    }

    saveQuizStats(siteType, updatedStats);
}

export const QUIZ_STATS_STORAGE_KEY = 'quizStats';

export type QuizFormationStats = {
    correct: number;
    incorrect: number;
};

export type QuizStats = Record<string, QuizFormationStats>;

export function getQuizFormationStatsKey(
    formation: Pick<Formation, 'discipline' | 'id'>,
) {
    return `${formation.discipline}:${formation.id}`;
}

export const meta: MetaFunction = () => [{ title: 'Quiz stats' }];

type FormationQuizStats = QuizFormationStats & {
    accuracy: number;
    formation: Formation;
    key: string;
    total: number;
};

function sortByAccuracy(first: FormationQuizStats, second: FormationQuizStats) {
    return (
        second.accuracy - first.accuracy ||
        second.correct - first.correct ||
        second.total - first.total
    );
}

function sortByIncorrect(
    first: FormationQuizStats,
    second: FormationQuizStats,
) {
    return (
        second.incorrect - first.incorrect ||
        first.accuracy - second.accuracy ||
        second.total - first.total
    );
}

function formationName(formation: Formation) {
    return getDisplayName(formation) ?? formation.id;
}

function FormationStatsTable({
    title,
    stats,
}: {
    title: string;
    stats: FormationQuizStats[];
}) {
    return (
        <div className="overflow-x-auto rounded-box border w-full">
            <table className="table">
                <thead>
                    <tr>
                        <th colSpan={5}>{title}</th>
                    </tr>
                    <tr className="">
                        <th>Formation</th>
                        <th className="text-right">Correct</th>
                        <th className="text-right">Incorrect</th>
                        <th className="text-right">Answered</th>
                        <th className="text-right">Accuracy</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((stat) => (
                        <tr key={stat.key}>
                            <td>
                                <span className="font-semibold">
                                    {stat.formation.id}
                                </span>{' '}
                                - {formationName(stat.formation)}
                            </td>
                            <td className="text-right">{stat.correct}</td>
                            <td className="text-right">{stat.incorrect}</td>
                            <td className="text-right">{stat.total}</td>
                            <td className="text-right">
                                {Math.round(stat.accuracy * 100)}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function QuizStatsPage() {
    const { quizStats, siteType } = useSiteStateContext();
    const formations = getAllFormations(siteType);
    const formationStats = Object.entries(quizStats).flatMap(([key, stats]) => {
        const formation = Object.values(formations).find(
            (candidate) => getQuizFormationStatsKey(candidate) === key,
        );
        if (!formation) {
            return [];
        }

        const total = stats.correct + stats.incorrect;
        if (total === 0) {
            return [];
        }

        return [
            {
                ...stats,
                accuracy: stats.correct / total,
                formation,
                key,
                total,
            },
        ];
    });
    const mostRemembered = [...formationStats].sort(sortByAccuracy).slice(0, 5);
    const mostMissed = [...formationStats].sort(sortByIncorrect).slice(0, 5);
    const allStats = [...formationStats].sort(
        (first, second) =>
            second.total - first.total || sortByAccuracy(first, second),
    );

    return (
        <div className="space-y-6 flex flex-col">
            <h1 className="text-3xl text-black">Quiz stats</h1>
            {formationStats.length === 0 ? (
                <div className="card text-black">
                    <div className="card-body">
                        <p>
                            Answer some quiz questions to start tracking your
                            formation memory.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <section>
                        <h2 className="text-2xl text-black mb-2">
                            Best remembered
                        </h2>
                        <FormationStatsTable
                            title="Highest accuracy"
                            stats={mostRemembered}
                        />
                    </section>
                    <section>
                        <h2 className="text-2xl text-black mb-2">
                            Most often incorrect
                        </h2>
                        <FormationStatsTable
                            title="Most incorrect answers"
                            stats={mostMissed}
                        />
                    </section>
                    <section>
                        <h2 className="text-2xl text-black mb-2">
                            All formations
                        </h2>
                        <FormationStatsTable
                            title="Answer history"
                            stats={allStats}
                        />
                    </section>
                </>
            )}
        </div>
    );
}
