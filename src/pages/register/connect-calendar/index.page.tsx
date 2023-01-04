import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";

import { Container, Header } from "../styles";
import { ConnectBox, ConnectItens } from "./styles";

export default function Register() {

    const handleRegister = async() => {
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
                        <Button type="button" variant="secondary" size="sm">
                            Conectar
                            <ArrowRight />
                        </Button>
                    </ConnectItens>
                    <Button type="submit">
                        Próximo passo
                        <ArrowRight />
                    </Button>
                </ConnectBox>
            </Header>
        </Container>
    )
}