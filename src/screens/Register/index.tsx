import React, { useState } from 'react'

import { Input } from '../../components/Form/Input'
import { Button } from '../../components/Form/Button'
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton'
import { CategorySelect } from '../../components/Form/CategorySelect'

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
} from './styles'

export function Register() {
    const [transactionType, setTransactionType] = useState('')

    function handleSelectedTransactionType(type: 'up' | 'down') {
        setTransactionType(type)
    }

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

                    <TransactionTypes>
                        <TransactionTypeButton 
                            type='up'
                            title='Income'
                            onPress={() => handleSelectedTransactionType('up')}
                            isActive={transactionType === 'up'}
                        />

                        <TransactionTypeButton 
                            type='down'
                            title='Outcome'
                            onPress={() => handleSelectedTransactionType('down')}
                            isActive={transactionType === 'down'}
                        />
                    </TransactionTypes>

                    <CategorySelect title='Categoria'/>
                </Fields>

                <Button title='Cadastrar'/>
            </Form>
        </Container>
    )
}