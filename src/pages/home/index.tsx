import Image from 'next/image'
import { Heading, Text } from '@ignite-ui/react'

import { Container, Hero, Preview } from './styles'

import PreviewImage from '../../assets/images/app-preview.png'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading as="h1" size="4xl">
          Agendamento descomplicado
        </Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.
        </Text>
        <ClaimUsernameForm />
      </Hero>
      <Preview>
        <Image
          src={ PreviewImage }
          height={ 400 }
          width={ 800 }
          quality={ 100 }
          priority
          alt="Calendário simbolizando aplicação em funcionamento" 
        />
      </Preview>
    </Container>
  )
}
