import { index, prefix, route } from '@react-router/dev/routes';

export default [
    index('pages/index.tsx'),
    ...prefix('8-way', [
        route('dive', 'pages/8-way/dive.tsx'),
        route('dive-builder', 'pages/8-way/dive-builder.tsx'),
        route('formation/:formationId', 'pages/8-way/formation.tsx'),
    ]),
    ...prefix('api', [
        route('async-tag', 'pages/api/async-tag.ts'),
        route(
            'generate-quiz-questions',
            'pages/api/generate-quiz-questions.ts',
        ),
    ]),
    ...prefix('competition', [
        route(':competitionId', 'pages/competition/index.tsx'),
        route('add', 'pages/competition/add.tsx'),
        route(':competitionId/edit', 'pages/competition/edit.tsx'),
    ]),
    ...prefix('flight', [
        route(':flightId', 'pages/flight/index.tsx'),
        route(':flightId/view', 'pages/flight/view.tsx'),
        route(':flightId/edit', 'pages/flight/edit.tsx'),
        route(':flightId/trim', 'pages/flight/trim.tsx'),
        route(':flightId/edit-scores', 'pages/flight/edit-scores.tsx'),
    ]),
    ...prefix('session', [
        route(':sessionId', 'pages/session/index.tsx'),
        route(':sessionId/edit', 'pages/session/edit.tsx'),
    ]),
    ...prefix('solo', [
        index('pages/solo/index.tsx'),
        route(':soloId', 'pages/solo/view.tsx'),
        route('add', 'pages/solo/add.tsx'),
    ]),
    route('customise-logo', 'pages/customise-logo.tsx'),
    route('flights/compare', 'pages/compare-flights.tsx'),
    route('formation/:formationId', 'pages/formation.tsx'),
    route('healthcheck', 'pages/healthcheck.tsx'),
    route('logos', 'pages/logos.tsx'),
    route('quiz', 'pages/quiz.tsx'),
    route('search', 'pages/search.tsx'),
    route('stats', 'pages/stats.tsx'),
    route('tag', 'pages/tag.tsx'),
    route('trim-pending', 'pages/trim-pending.tsx'),
];
