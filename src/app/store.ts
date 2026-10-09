import companiesReducer from "@/features/companies/companiesSlice.ts"
import vacanciesReducer from "@/features/vacancies/vacanciesSlice.ts"
import notesReducer from "@/features/notes/notesSlice.ts"
import {configureStore} from "@reduxjs/toolkit"
import {logger} from "redux-logger"
import {loadState, saveState, throttle} from "@/utils/localStorageUtils.ts"

export const store = configureStore({
    reducer: {
        companies: companiesReducer,
        vacancies: vacanciesReducer,
        notes: notesReducer
    },
    preloadedState: loadState(),
    middleware: (getDefaultMiddleware) => {
        const middleware = getDefaultMiddleware()
        if (import.meta.env.MODE === 'development') {
            middleware.push(logger)
        }
        return middleware
    },
})

store.subscribe(
    throttle(() => saveState(store.getState()))
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch