import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { ArrowRight, Check } from "phosphor-react";

import { Container, Header } from "../styles";
import { AuthError, ConnectBox, ConnectItens } from "./styles";

export default function ConnectCallendar() {

    const { status } = useSession()
    const router = useRouter()

    const hasAuthError = !!router.query.error
    const hasAuthenticated = status === "authenticated"

    const handleConnectionCalendar = async() => {
        await signIn("google")
    }

    const handleNavigateToNextStep = async() => {
        await router.push("/register/time-intervals")
    }

    return (
        <Container>
            <Header>
                <Heading as="strong">
                    Bem-vindo ao Ignite Call!
                </Heading>
                <Text>
                    Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
                </Text>
                <MultiStep size={4} currentStep={2} />
                <ConnectBox>
                    <ConnectItens>
                        <Text>Google Calendar</Text>
                        {
                            hasAuthenticated ? (
                                <Button disabled size="sm">
                                    Conectado
                                    <Check />
                                </Button>
                            ): (
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    size="sm"
                                    onClick={ handleConnectionCalendar }
                                >
                                    Conectar
                                    <ArrowRight />
                                </Button>
                            )
                        }
                    </ConnectItens>
                    { hasAuthError && (
                        <AuthError size="sm">
                            Falha ao se conectar ao Google, verifique se você habilitou as permisões de acesso ao Google Calendar. 
                        </AuthError>
                    ) }
                    <Button 
                        type="button"
                        onClick={ handleNavigateToNextStep }
                        disabled={ hasAuthError }
                    >
                        Próximo passo
                        <ArrowRight />
                    </Button>
                </ConnectBox>
            </Header>
        </Container>
    )
}