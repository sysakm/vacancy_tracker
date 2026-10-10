import {type VacancyNote} from "@/types/vacancyTypes.ts"
import {type SubmitEvent, useState} from "react"
import {nextNoteIdSelector} from "@/app/selectors.ts"
import {useAppSelector} from "@/app/hooks.ts"

type Props = {
    onSubmit: (id: number, vacancyId: number, note: string) => void;
    note?: VacancyNote;
    vacancyId?: number;
}

function NoteEditorForm({onSubmit, note, vacancyId}: Props) {
    const [currentText, setCurrentText] = useState(note?.note ?? '')
    const nextId= useAppSelector(nextNoteIdSelector)


    const realVacancyId = note?.vacancyId ?? vacancyId ?? null
    // TODO: add explicit reaction to null id when adding validation to the form

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        if (realVacancyId) {
            onSubmit(note?.id ?? nextId, realVacancyId, currentText)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor='noteText'>
                <span>Note Text</span>
                <textarea
                    id='noteText' value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                />
            </label>
            <button type='submit'>{note ? 'Update note' : 'Add note'}</button>
        </form>
    )
}

export default NoteEditorForm