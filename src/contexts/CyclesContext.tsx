import { createContext, ReactNode, useState, useReducer, useEffect } from "react"
import { Cycle, CyclesRecuder } from "../reducers/cycles/reducer"
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions"

interface CreateCycleData {
    task: string
    minutesAmount: number
}

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    cycleActiveId: string | null
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({
    children,
}: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(CyclesRecuder, {
        cycles: [],
        cycleActiveId: null
    }, () => {
        const storedStateAsJSON = localStorage.getItem('@Timer-Pomodoro:Cycles-State-1.0.0');
        if (storedStateAsJSON) {
            return JSON.parse(storedStateAsJSON)
        }
    })

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState)
        localStorage.setItem('@Timer-Pomodoro:Cycles-State-1.0.0', stateJSON)
    }, [cyclesState])

    const { cycles, cycleActiveId } = cyclesState
    const activeCycle = cycles.find(cycle => cycle.id == cycleActiveId)

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction())
    }

    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime());
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        dispatch(addNewCycleAction(newCycle))
        setAmountSecondsPassed(0)
    }

    function interruptCurrentCycle() {
        dispatch(interruptCurrentCycleAction())
        document.title = "Ignite Timer"
    }

    return (

        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                cycleActiveId,
                amountSecondsPassed,
                markCurrentCycleAsFinished,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle
            }}>
            {children}
        </CyclesContext.Provider>
    )
}


