import React, { useState } from 'react'
import { Modal } from 'react-native'

import { Input } from '../../components/Form/Input'
import { Button } from '../../components/Form/Button'
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton'
import { CategorySelectButton } from '../../components/Form/CategorySelectButton'

import { CategorySelect } from '../CategorySelect'

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
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)
    const [category, setCategory] = useState({
        key: 'category',
        name: 'categoria'
    })

    function handleSelectedTransactionType(type: 'up' | 'down') {
        setTransactionType(type)
    }

    function handleCategoryModalOpen() {
        setCategoryModalOpen(true)
    }

    function handleCategoryModalClose() {
        setCategoryModalOpen(false)
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

                    <CategorySelectButton 
                        title='Categoria'
                        onPress={handleCategoryModalOpen}
                    />
                </Fields>

                <Button title='Cadastrar'/>
            </Form>

            <Modal visible={categoryModalOpen}>
                <CategorySelect 
                    category={category}
                    setCategory= {setCategory}
                    closeSelectCategory={handleCategoryModalClose}
                />
            </Modal>
        </Container>
    )
}