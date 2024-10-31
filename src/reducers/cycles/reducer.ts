import { ActionTypes } from "./actions"
import { produce } from "immer"


export interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

interface CyclesState {
    cycles: Cycle[],
    cycleActiveId: string | null
}

export function CyclesRecuder(state: CyclesState, action: any) {
    switch (action.type) {
        case ActionTypes.ADD_NEW_CYCLE:
            return produce(state, (draft) => {
                draft.cycles.push(action.payload.newCycle)
                draft.cycleActiveId = action.payload.newCycle.id
            })

        case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
            const currentCycleIndex = state.cycles.findIndex((cycle) => {
                return cycle.id == state.cycleActiveId
            })

            if (currentCycleIndex < 0) {
                return state
            }

            return produce(state, (draft) => {
                draft.cycleActiveId = null;
                draft.cycles[currentCycleIndex].interruptedDate = new Date()
            })
        }
        case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
            const currentCycleIndex = state.cycles.findIndex((cycle) => {
                return cycle.id == state.cycleActiveId
            })

            if (currentCycleIndex < 0) {
                return state
            }

            return produce(state, (draft) => {
                draft.cycleActiveId = null;
                draft.cycles[currentCycleIndex].finishedDate = new Date()
            })
        }
        default:
            return state
    }

}