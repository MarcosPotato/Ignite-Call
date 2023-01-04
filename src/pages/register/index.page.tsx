import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from 'axios'

import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";

import { Container, Form, FormError, Header } from "./styles";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "../../lib/axios";

const registerFormSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Usuário deve ter pelo menos 3 letras" })
        .regex(/^([a-z\\-]+)$/i, { message: "Usuário pode ter apenas letrar e hífens" })
        .transform(value => value.toLowerCase()),
    fullname: z
        .string()
        .min(3, { message: "Nome deve ter pelo menos 3 letras" })
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {

    const router = useRouter()

    const { 
        register, 
        handleSubmit, 
        setValue,
        formState: { errors, isSubmitting } 
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema)
    })

    const handleRegister = async(data: RegisterFormData) => {
        try{
            await api.post("/users", {
                fullname: data.fullname,
                username: data.username
            })

            await router.push("/register/connect-calendar")
        } catch(err: any){
            if(err instanceof AxiosError && err?.response?.data?.message){
                alert(err.response.data.message)
                return
            }

            console.log(err)
        }
    }

    useEffect(() => {
        if(router.query?.username){
            setValue("username", String(router.query.username))
        }
    },[router.query?.username, setValue])
    return (
        <Container>
            <Header>
                <Heading as="strong">
                    Bem-vindo ao Ignite Call!
                </Heading>
                <Text>
                    Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
                </Text>

                <MultiStep size={4} currentStep={1} />
            </Header>
            <Form as="form" onSubmit={ handleSubmit(handleRegister) }>
                <label>
                    <Text size="sm">Nome de Usuário</Text>
                    <TextInput
                        size="sm"
                        prefix="ignite.com/"
                        placeholder="Seu usuário"
                        { ...register("username") }
                    />
                    { errors.username && <FormError size="sm">{ errors.username.message }</FormError> }
                </label>
                <label>
                    <Text size="sm">Nome completo</Text>
                    <TextInput
                        size="sm"
                        placeholder="Seu nome"
                        { ...register("fullname") }
                    />
                    { errors.fullname && <FormError size="sm">{ errors.fullname.message }</FormError> }
                </label>
                <Button type="submit" disabled={ isSubmitting }>
                    Próximo passo
                    <ArrowRight />
                </Button>
            </Form>
        </Container>
    )
}