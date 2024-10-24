import { Circle, HandPalm, Play } from "phosphor-react";
import { FormContainer, HomeContainer, CountdownContainer, Separator, StartCountdownButton, StopCountdownButton, TaskInput, MinutesAmountInput } from "./styles";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useState, useEffect } from "react";
import { differenceInSeconds } from 'date-fns'
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

const newCicleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number()
        .min(1, 'O ciclo precisa ser de no mínimo 5 minutos')
        .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})
interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

type newFormCicleData = zod.infer<typeof newCicleFormValidationSchema>

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [cycleActiveId, setSycleActiveId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const { register, handleSubmit, watch, reset } = useForm<newFormCicleData>({
        resolver: zodResolver(newCicleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    const activeCycle = cycles.find(cicle => cicle.id == cycleActiveId)
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

    useEffect(() => {
        let interval: number;

        if (activeCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)
                if (secondsDifference >= totalSeconds) {
                    setCycles(state =>
                        state.map((cycle) => {
                            if (cycle.id == cycleActiveId) {
                                return { ...cycle, finishedDate: new Date() }
                            } else {
                                return cycle
                            }
                        })
                    )
                    setAmountSecondsPassed(totalSeconds)
                    clearInterval(interval);
                } else {
                    setAmountSecondsPassed(secondsDifference)
                }
            }, 1000);
        }
        return () => {
            clearInterval(interval);
        }

    }, [activeCycle, totalSeconds, cycleActiveId])

    function handleCreateNewCycle(data: newFormCicleData) {
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

        reset();
    }

    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

    const minutesAmount = Math.floor(currentSeconds / 60);
    const secondsAmount = currentSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, '0');
    const seconds = String(secondsAmount).padStart(2, '0');

    useEffect(() => {
        if (activeCycle) {
            document.title = `Ignite Timer: ${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    const task = watch('task');
    const isSubmitDisabled = !task;

    function handleInterruptCycle() {
        setCycles((state) =>
            state.map((cycle) => {
                if (cycle.id == cycleActiveId) {
                    return { ...cycle, interruptedDate: new Date() }
                } else {
                    return cycle
                }
            })
        )
        setSycleActiveId(null)
    }

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
               <NewCycleForm/>
               <Countdown/>

                {activeCycle ?
                    <StopCountdownButton onClick={handleInterruptCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton> :
                    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                }

            </form>


        </HomeContainer>
    )
}