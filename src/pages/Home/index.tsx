import { Play } from "phosphor-react";
import { FormContainer, HomeContainer, CountdownContainer, Separator, StartCountdownButton, TaskInput, MinutesAmountInput } from "./styles";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

const newCicleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number()
        .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
        .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type newFormCicleData = zod.infer<typeof newCicleFormValidationSchema>
 
export function Home() {

    const { register, handleSubmit, watch, reset } = useForm<newFormCicleData>({
        resolver: zodResolver(newCicleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    function handleCreateNewCycle(data: newFormCicleData) {
        console.log(data);
        reset();
    }
    
    const task = watch('task');
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput
                        id="task"
                        placeholder="Dê um nome para seu projeto"
                        list="task-suggestions"
                        {...register('task')}

                    />
                    <datalist id="task-suggestions">
                        <option value="Projeto 1" />
                        <option value="Projeto 2" />
                        <option value="Projeto 3" />
                        <option value="Banana" />
                    </datalist>

                    <label htmlFor="">Durante</label>
                    <MinutesAmountInput
                        type="number"
                        id="minutesAmount"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                    <Play size={24} />
                    Começar
                </StartCountdownButton>
            </form>


        </HomeContainer>
    )
}