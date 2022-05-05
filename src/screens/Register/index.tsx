import React, { useState } from 'react'

import { InputForm } from '../../components/Form/InputForm'
import { Button } from '../../components/Form/Button'
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton'
import { CategorySelectButton } from '../../components/Form/CategorySelectButton'
import { CategorySelect } from '../CategorySelect'

import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert 
} from 'react-native'

import { useAuth } from '../../hooks/auth'
import { useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'

import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'

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

interface NavigationProps {
    navigate: (screen: string) => void
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

    const { user } = useAuth()

    const navigation = useNavigation<NavigationProps>()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    })

    function handleSelectedTransactionType(type: 'positive' | 'negative') {
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

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const dataKey = `gofinances:transactions_user:${user.id}`
            const data = await AsyncStorage.getItem(dataKey)
            const currentData = data ? JSON.parse(data) : []

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

            reset()
            setTransactionType('')
            setCategory({
                key: 'category',
                name: 'categoria'
            })

            navigation.navigate('Listagem')

        } catch (error) {
            console.log('screens: Register\nfunction: handleRegister\nerror', error)
            Alert.alert('Não foi possível realizar o cadastro!')
        }
    }

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
                                onPress={() => handleSelectedTransactionType('positive')}
                                isActive={transactionType === 'positive'}
                            />

                            <TransactionTypeButton 
                                type='down'
                                title='Outcome'
                                onPress={() => handleSelectedTransactionType('negative')}
                                isActive={transactionType === 'negative'}
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