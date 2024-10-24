import styled from "styled-components"

export const HomeContainer = styled.main`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    form{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3.5rem
    }

    label{
        display: flex;
        justify-content: center;
        align-items: center;
    }
`

export const BaseCountdownButtonton = styled.button`
    width: 100%;
    border: 0;
    padding: 1rem;
    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 0.5rem;
    font-weight: bold;

    cursor: pointer;

    color: ${(props) => props.theme['gray-100']};

    &:disabled{
        opacity: 0.7;
        cursor: not-allowed;
    }

`

export const StopCountdownButton = styled(BaseCountdownButtonton)`
    background: ${(props) => props.theme['red-500']};
    
    &:hover {
        background: ${(props) => props.theme['red-700']};
    }
`

export const StartCountdownButton = styled(BaseCountdownButtonton)`
    background: ${(props) => props.theme['green-500']};

    &:not(:disabled):hover {
        background: ${(props) => props.theme['green-700']};
    }
`