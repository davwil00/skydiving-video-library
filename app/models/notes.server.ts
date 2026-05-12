import { prisma } from '~/db.server';
import type { NoteUncheckedCreateInput } from '../../prisma/generated/models/Note';

export function addNote(note: NoteUncheckedCreateInput) {
    return prisma.note.create({
        data: note,
    });
}
