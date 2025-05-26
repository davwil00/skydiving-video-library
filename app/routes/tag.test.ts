import { loader } from './tag'
import { describe, expect, test } from 'vitest';

describe('Tag', () => {
    describe('Loader', () => {
        test('Should return data in the correct format', async() => {
            const actual = await loader()
            expect(actual).to.have.length(10)
        })
    })
})
