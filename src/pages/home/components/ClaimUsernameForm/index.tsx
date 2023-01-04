import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button, Text, TextInput } from "@ignite-ui/react"
import { ArrowRight } from "phosphor-react"

import { Form, FormAnnotation } from "./styles"

const claimUsernameFormSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Usuário deve ter pelo menos 3 letras" })
        .regex(/^([a-z\\-]+)$/i, { message: "Usuário pode ter apenas letrar e hífens" })
        .transform(value => value.toLowerCase())
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export const ClaimUsernameForm: React.FC = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<ClaimUsernameFormData>({
        resolver: zodResolver(claimUsernameFormSchema)
    })

    const handleClaimUsername = async(data: ClaimUsernameFormData) => {

    }

    return(
        <>
        <Form as="form" onSubmit={ handleSubmit(handleClaimUsername) }>
            <TextInput
                size="sm"
                prefix="ignite.com/"
                placeholder="Seu usuário"
                { ...register("username") }
            />
            <Button 
                size="sm"
                type="submit"
            >
                Reservar
                <ArrowRight />
            </Button>  
        </Form>
        <FormAnnotation>
            <Text size={"sm"}>
                { errors.username ? errors.username?.message : "Digite o nome do usuário desejado" }
            </Text>
        </FormAnnotation>
        </>
    )
}