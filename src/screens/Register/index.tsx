import React, { useState, useEffect } from 'react'
import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert 
} from 'react-native'
import { useForm } from 'react-hook-form'

import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { InputForm } from '../../components/Form/InputForm'
import { Button } from '../../components/Form/Button'
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton'
import { CategorySelectButton } from '../../components/Form/CategorySelectButton'
import { CategorySelect } from '../CategorySelect'

import AsyncStorage from '@react-native-async-storage/async-storage'

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

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Favor, informar o nome!'),
    amount: Yup
    .number()
    .required('O valor da transação deve ser numérico!')
    .positive('O valor não pode ser negativo!')
    .typeError('O valor da transação deve ser numérico!')
})

export function Register() {
    const [transactionType, setTransactionType] = useState('')
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)
    const [category, setCategory] = useState({
        key: 'category',
        name: 'categoria'
    })

    const dataKey = '@gofinances:transactions'

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
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

    async function handleRegister(form: Partial<FormData>) {
        if(!transactionType) {
            return Alert.alert('Selecione o tipo da transação')
        }
        if(category.key === 'category') {
            return Alert.alert('Selecione a categoria')
        }

        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key
        }

        console.log(data)

        try {
            await AsyncStorage.setItem(dataKey, JSON.stringify(data))

        } catch (error) {
            console.log('screens: Register\nfunction: handleRegister\nerror', error)
            Alert.alert('Não foi possível realizar o cadastro!')
        }
    }

    useEffect(() => {
        async function loadData() {
            const loadedData = await AsyncStorage.getItem(dataKey)
            console.log(JSON.parse(loadedData!))
        }

        loadData()
    },[])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                            autoCapitalize='sentences'
                            autoCorrect={false}
                            error={errors.name && errors.name.message} 
                        />

                        <InputForm 
                            placeholder='Preço' 
                            control={control}
                            name='amount'
                            keyboardType='numeric'
                            error={errors.amount && errors.amount.message}
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
        </TouchableWithoutFeedback>
    )
}