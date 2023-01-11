import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import { CalendarBlank, Clock } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ConfirmForm, FormActions, FormError, FormHeader } from "./style";

const confirmFormSchema = z.object({
    name: z.string().min(3, { message: "O nome precisa no mínimo 3 caracteres" }),
    email: z.string().email("E-mail inválido"),
    observations: z.string().optional()
})

type ConfirmFormSchema = z.infer<typeof confirmFormSchema>

export function ConfirmStep(){

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ConfirmFormSchema>({
        resolver: zodResolver(confirmFormSchema)
    })

    const handleConfirm = async(data: ConfirmFormSchema) => {

    }

    return (
        <ConfirmForm 
            as="form" 
            onSubmit={handleSubmit(handleConfirm)}
        >
            <FormHeader>
                <Text>
                    <CalendarBlank/>
                    22 de setem
                </Text>
                <Text>
                    <Clock />
                    18:00h
                </Text>
            </FormHeader>
            <label>
                <Text size="sm">Nome completo</Text>
                <TextInput
                    placeholder="Seu nome" 
                    { ...register("name") }
                />
                { errors.name && (
                    <FormError size="sm">
                        { errors.name.message }
                    </FormError>
                ) }
            </label>
            <label>
                <Text size="sm">Endereço de e-mail</Text>
                <TextInput 
                    type="email" 
                    placeholder="johndoe@example.com"
                    { ...register("email") }
                />
                { errors.email && (
                    <FormError size="sm">
                        { errors.email.message }
                    </FormError>
                ) }
            </label>
            <label>
                <Text size="sm">Observações</Text>
                <TextArea { ...register("observations") } />
            </label>
            <FormActions>
                <Button type="button" variant="tertiary">
                    Cancelar
                </Button>
                <Button type="submit">
                    Confirmar
                </Button>
            </FormActions>
        </ConfirmForm>
    )
}