import React from 'react'
import { Input } from '../../components/Form/Input'
import { Button } from '../../components/Form/Button'

import { 
    Container,
    Header,
    Title,
    Form,
    Fields
} from './styles'

export function Register() {
    return (
        <Container>
            <Header>
                <Title>
                    Cadastro
                </Title>
            </Header>

            <Form>
                <Fields>
                    <Input placeholder='Nome'>

                    </Input>

                    <Input placeholder='Preço'>
                        
                    </Input>
                </Fields>

                <Button title='Cadastrar'/>
            </Form>
        </Container>
    )
}