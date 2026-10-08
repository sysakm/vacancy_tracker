import type {RootState} from "@/app/store.ts"
// import {validateRootState} from "@/utils/localStorageValidationUtils.ts"

function validateRootState(_state: unknown) {
    return true
}

const STORAGE_KEY = 'vacancy-tracker-application-rtk-state-v0'

function clearState() {
    localStorage.removeItem(STORAGE_KEY)
}

export function saveState(state: RootState) {
    try {
        const stateString = JSON.stringify(state)
        localStorage.setItem(STORAGE_KEY, stateString)
    } catch (error) {
        console.warn('Could not save state to localStorage: ', error instanceof Error ? error.message : 'something went wrong')
    }
}

export function loadState(): unknown | undefined {
    try {
        const stateString = localStorage.getItem(STORAGE_KEY)
        if (!stateString) {
            return undefined
        } else {
            const state: unknown = JSON.parse(stateString)
            if (!validateRootState(state)) {
                throw new Error('localStorage state corrupted: ' + stateString)
            } else {
                return state
            }
        }
    } catch (error) {
        clearState()
        console.warn('Could not load state from localStorage: ', error instanceof Error ? error.message : 'something went wrong')
        return undefined
    }
}

export function throttle(func: Function, limit: number = 1000) {
    let isThrottling: boolean
    let lastArgs: Array<unknown> | null = null
    return function (...args: Array<unknown>) {
        if (!isThrottling) {
            func(...args)
            isThrottling = true
            setTimeout(() => {
                isThrottling = false
                if (lastArgs) {
                    func(...lastArgs)
                    lastArgs = null
                }
            }, limit)
        } else {
            lastArgs = args
        }
    }
}