import {type VacancyNote} from "@/types/vacancyTypes.ts"
import {type SubmitEvent, useState} from "react"
import {nextNoteIdSelector} from "@/app/selectors.ts"
import {useAppSelector} from "@/app/hooks.ts"

type Props = {
    onSubmit: (id: number, vacancyId: number, note: string) => void;
    note?: VacancyNote;
    vacancyId?: number;
}

function validateForm(realVacancyId: number | null, currentText: string) {
    if (!realVacancyId) return 'Something went wrong - can not find the vacancy'
    if (!currentText.trim()) return 'Note text can not be empty'
    return null
}

function NoteEditorForm({onSubmit, note, vacancyId}: Props) {
    const [currentText, setCurrentText] = useState(note?.note ?? '')

    const [error, setError] = useState('')

    const nextId= useAppSelector(nextNoteIdSelector)

    const realVacancyId = note?.vacancyId ?? vacancyId ?? null

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        const newError = validateForm(realVacancyId, currentText)
        if (newError || !realVacancyId) {
            setError(newError ?? 'Something went wrong')
        } else {
            onSubmit(note?.id ?? nextId, realVacancyId, currentText.trim())
            setCurrentText('')
            setError('')
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
            {error && (<p className='form__error' role='alert'>{error}</p>)}
        </form>
    )
}

export default NoteEditorForm