import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Button, Heading, MultiStep, Text, TextArea } from "@ignite-ui/react";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../lib/axios";
import { buildNextAuthOptions } from "../../api/auth/[...nextauth].api";
import { Container, Header } from "../styles";
import { FormAnotation, ProfileBox } from "./style";

const prolifeFormSchema = z.object({
    bio: z.string()
})

type ProfileFormInput = z.input<typeof prolifeFormSchema>

export default function UpdateProfile (){
    const {
        register,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<ProfileFormInput>({
        resolver: zodResolver(prolifeFormSchema),
    })

    const session = useSession()
    
    const router = useRouter()

    const handleUserProfile = async (data: ProfileFormInput) => {
        await api.put("/users/update-profile", {
            bio: data.bio
        })

        await router.push(`/schedule/${ session.data?.user.username }`)
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

                <MultiStep size={4} currentStep={4} />
            </Header>
            <ProfileBox as="form" onSubmit={handleSubmit(handleUserProfile)}>
                <label>
                    <Text size="sm">Foto de perfil</Text>
                    <Avatar src={ session.data?.user.avatar_url } alt={ session.data?.user.name || "username" }/>
                </label>
                <label>
                    <Text size="sm">Sobre você</Text>
                    <TextArea { ...register("bio") }/>
                    <FormAnotation size="sm">
                        Fale um pouco sobre você. Isto será exibido em sua página pessoal.
                    </FormAnotation>
                </label>
                <Button type="submit" disabled={ isSubmitting }>
                    Finalizar
                    <ArrowRight/>
                </Button>
            </ProfileBox>
        </Container>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await unstable_getServerSession(
        req,
        res,
        buildNextAuthOptions(req, res)
    )
    
    return {
        props: {
            session
        }
    }
}