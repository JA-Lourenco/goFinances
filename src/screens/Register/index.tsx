import React, { useState } from 'react'
import { Modal } from 'react-native'
import { useForm } from 'react-hook-form'

import { InputForm } from '../../components/Form/InputForm'
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

interface FormData {
    name: string
    amount: string
}

export function Register() {
    const [transactionType, setTransactionType] = useState('')
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)
    const [category, setCategory] = useState({
        key: 'category',
        name: 'categoria'
    })

    const {
        control,
        handleSubmit
    } = useForm()

    function handleSelectedTransactionType(type: 'up' | 'down') {
        setTransactionType(type)
    }

    function handleCategoryModalOpen() {
        setCategoryModalOpen(true)
    }

    function handleCategoryModalClose() {
        setCategoryModalOpen(false)
    }

    function handleRegister(form: Partial<FormData>) {
        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key
        }

        console.log(data)
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
                    <InputForm 
                        placeholder='Nome'
                        control={control}
                        name='name' 
                    />

                    <InputForm 
                        placeholder='Preço' 
                        control={control}
                        name='amount'
                    />

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
                        title={category.name}
                        onPress={handleCategoryModalOpen}
                    />
                </Fields>

                <Button 
                    title='Cadastrar'
                    onPress={handleSubmit(handleRegister)}
                />
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