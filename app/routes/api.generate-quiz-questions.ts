import { allFormations, type Formation } from '~/data/formations';
import { findFlightsWithFormationsIn } from '~/models/flights.server';
import {
    type FormationQuestion,
    type Question,
    type QuestionSet,
    type QuizState,
    QuizType,
    type Slot,
    type SlotQuestion,
    type VideoQuestion,
} from '~/state/quiz-reducer';
import { getSiteType, type SiteType } from '~/utils/site-utils';
import { shuffle } from '~/utils/utils';
import type { Route } from '../../.react-router/types/app/routes/+types/tag';

export const action = async ({
    request,
}: Route.ActionArgs): Promise<Question[]> => {
    if (request.method !== 'POST') {
        throw new Response('Method not allowed', { status: 405 });
    }
    const state: QuizState = await request.json();
    const siteType = getSiteType(request);
    return await generateQuestions(state, siteType);
};

async function generateQuestions(
    state: QuizState,
    siteType: SiteType,
): Promise<Question[]> {
    switch (state.quizType) {
        case QuizType.FIND_YOUR_SLOT:
            return generateSlotQuestions(
                state.slots,
                state.questionSets,
                state.numberOfQuestions,
            );
        case QuizType.VIDEO:
            return await generateVideoQuestions(
                state.questionSets,
                state.numberOfQuestions,
                siteType,
            );
        default:
            return generateFormationQuestions(
                state.questionSets,
                state.numberOfQuestions,
            );
    }
}

function getFormationsToIncludeFromQuestionSets(
    questionSets: QuestionSet[],
): Formation[] {
    const formationsToInclude = allFormations.filter((formation) =>
        questionSets.some(
            (questionSet) =>
                formation.discipline === questionSet.discipline &&
                formation.level === questionSet.level &&
                formation.type === questionSet.type,
        ),
    );
    shuffle(formationsToInclude);
    return formationsToInclude;
}

function generateFormationQuestions(
    questionSets: QuestionSet[],
    numberOfQuestions: number,
): FormationQuestion[] {
    const formationsToInclude =
        getFormationsToIncludeFromQuestionSets(questionSets);
    const numberOfQuestionsToGenerate =
        formationsToInclude.length > numberOfQuestions
            ? numberOfQuestions
            : formationsToInclude.length;
    return formationsToInclude
        .slice(0, numberOfQuestionsToGenerate)
        .map((formation) => ({
            answer: formation,
            choices: generateMultipleChoiceAnswers(formation),
        }));
}

function generateSlotQuestions(
    slots: Slot[],
    questionSets: QuestionSet[],
    numberOfQuestions: number,
): SlotQuestion[] {
    const slotsToInclude = [...slots];
    const formationsToInclude =
        getFormationsToIncludeFromQuestionSets(questionSets);
    const numberOfQuestionsToGenerate =
        formationsToInclude.length > numberOfQuestions
            ? numberOfQuestions
            : formationsToInclude.length;
    return formationsToInclude
        .slice(0, numberOfQuestionsToGenerate)
        .map((formation) => {
            shuffle(slotsToInclude);
            const slotToIdentify = slotsToInclude[0];
            return {
                formation,
                slotToIdentify,
            };
        });
}

async function generateVideoQuestions(
    questionSets: QuestionSet[],
    numberOfQuestions: number,
    siteType: SiteType,
): Promise<VideoQuestion[]> {
    const formationsToInclude =
        getFormationsToIncludeFromQuestionSets(questionSets);
    const flights = await findFlightsWithFormationsIn(
        formationsToInclude.map((formation) => formation.id),
        siteType,
    );
    const numberOfQuestionsToGenerate =
        formationsToInclude.length > numberOfQuestions
            ? numberOfQuestions
            : formationsToInclude.length;
    shuffle(flights);
    return flights
        .slice(0, numberOfQuestionsToGenerate)
        .filter((flight) => flight.topVideoUrl && flight.formations.length > 0)
        .map((flight) => ({
            answer: flight.formations.map((formation) => formation.formationId),
            // biome-ignore lint/style/noNonNullAssertion: filtered above
            videoUrl: flight.topVideoUrl!,
        }));
}

function generateMultipleChoiceAnswers(actualAnswer: Formation): Formation[] {
    const possibleAlternateAnswers: Formation[] = allFormations.filter(
        (formation) =>
            formation.level === actualAnswer.level &&
            formation.discipline === actualAnswer.discipline &&
            formation.type === actualAnswer.type &&
            formation !== actualAnswer,
    );
    shuffle(possibleAlternateAnswers);
    const answers = possibleAlternateAnswers.slice(0, 3).concat(actualAnswer);
    shuffle(answers);
    return answers;
}
