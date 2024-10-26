import { createContext, ReactNode, useState } from "react"

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

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}


export function CyclesContextProvider({children}: CyclesContextProviderProps) {

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [cycleActiveId, setSycleActiveId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const activeCycle = cycles.find(cicle => cicle.id == cycleActiveId)

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        setCycles(state =>
            state.map((cycle) => {
                if (cycle.id == cycleActiveId) {
                    return { ...cycle, finishedDate: new Date() }
                } else {
                    return cycle
                }
            })
        )
    }

    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime());
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        setCycles((status) => [...status, newCycle])
        setSycleActiveId(id)
        setAmountSecondsPassed(0)

        // reset();
    }
    
    function interruptCurrentCycle() {
        setCycles((state) =>
            state.map((cycle) => {
                if (cycle.id == cycleActiveId) {
                    return { ...cycle, interruptedDate: new Date() }
                } else {
                    return cycle
                }
            })
        )
        document.title = "Ignite Timer"
        setSycleActiveId(null)
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


