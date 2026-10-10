import type {Company, Vacancy, VacancyNote} from "@/types/vacancyTypes.ts"
import {useAppDispatch, useAppSelector} from "@/app/hooks.ts"
import {notesSelector} from "@/app/selectors.ts"
import NoteEditorForm from "@/components/NoteEditorForm.tsx"
import {addNote, removeNote, updateNote} from "@/features/notes/notesSlice.ts"
import {useState} from "react"

type Props = {
    vacancy: Vacancy;
    company?: Company;
}

function NoteList({vacancy, company}: Props) {
    const dispatch = useAppDispatch()
    const notes = useAppSelector(notesSelector).filter(note => note.vacancyId === vacancy.id)

    const [currentEditingNote, setCurrentEditingNote] = useState<VacancyNote | undefined>(undefined)

    function handleAddNote(id: number, vacancyId: number, note: string) {
        dispatch(addNote({id, vacancyId, note}))
    }
    function handleUpdateNote(id: number, vacancyId: number, note: string) {
        setCurrentEditingNote(undefined)
        dispatch(updateNote({id, vacancyId, note}))
    }
    function handleRemoveNote(id: number) {
        if (currentEditingNote?.id === id) {
            setCurrentEditingNote(undefined)
        }
        dispatch(removeNote(id))
    }

    return (
        <section>
            <h3>Notes for {vacancy.name} @ {company?.name ?? 'Unknown Company'}</h3>
            <div>
                {notes.map((note, idx) => (note.id !== currentEditingNote?.id ?
                    <div key={`note-${note.id}`}>
                        <p>{idx+1} {note.note}</p>
                        <span>
                            <button type='button' onClick={() => setCurrentEditingNote(note)}>
                                Edit
                            </button>
                            <button type='button' onClick={() => handleRemoveNote(note.id)}>
                                Delete
                            </button>
                        </span>
                    </div> :
                    <div key={`note-edit-${note.id}`}>
                        <aside>{idx+1}</aside>
                        <NoteEditorForm
                            onSubmit={handleUpdateNote}
                            note={currentEditingNote}
                            vacancyId={vacancy.id}
                        />
                    </div>
                ))}
            </div>
            {!currentEditingNote && <NoteEditorForm
                key={`note-editor-${vacancy.id}-${notes.length}`}
                onSubmit={handleAddNote}
                vacancyId={vacancy.id}
            />}
        </section>
    )
}

export default NoteList