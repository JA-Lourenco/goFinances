import React, { useCallback, useEffect, useState } from 'react'

import { ActivityIndicator } from 'react-native'

import { useFocusEffect } from '@react-navigation/native'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'
import { BorderlessButtonProps } from 'react-native-gesture-handler'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { useTheme } from 'styled-components'

import { 
    Container,
    Header,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    UserWrapper,
    Icon,
    LogoutButton,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
    LoadContainer
} from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string
}

interface HighlightProps {
    amount: string
}

interface HighlightData {
    entries: HighlightProps
    cost: HighlightProps
    total: HighlightProps
}

interface LogoutButtonProps extends BorderlessButtonProps {
    onPress: () => void
}

export function Dashboard({ ...rest } : LogoutButtonProps) {
    const [isLoading, setIsLoaging] = useState(true)
    const [transactions, setTransactions] = useState<DataListProps[]>([])
    const [highlightData, setHighlightData] = useState<HighlightData>()

    const theme = useTheme()

    async function loadTransactions() {
        const dataKey = '@gofinances:transactions'
        const response = await AsyncStorage.getItem(dataKey)

        const transactionsResponse = response ? JSON.parse(response) : []

        let entriesTotal = 0
        let costTotal = 0 
        

        const transactionsFormatted: DataListProps[] = transactionsResponse.map(
            (item: DataListProps) => {
                if(item.type === 'positive') {
                    entriesTotal += Number(item.amount)
                }
                else {
                    costTotal += Number(item.amount)
                }

                const amount = Number(item.amount)
                                .toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })
                
                const date = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date))

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date
                }
            }
        )

        setTransactions(transactionsFormatted)
        
        let total = entriesTotal - costTotal

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            cost: {
                amount: costTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            }
        })

        setIsLoaging(false)
    }

    useEffect(() => {
        loadTransactions()
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransactions()
    }, []))

    return (
        <Container>
            {
                isLoading ?
                <LoadContainer>
                    <ActivityIndicator 
                        color={theme.colors.primary} 
                        size='large'
                    />
                </LoadContainer>  : 
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo 
                                    source={{uri: 'https://avatars.githubusercontent.com/u/93841387?v=4'}}
                                />
                                
                                <User>
                                    <UserGreeting>Olá,</UserGreeting>
                                    <UserName>João Antonio</UserName>
                                </User>
                            </UserInfo>

                            <LogoutButton
                                {...rest}
                            >
                                <Icon name='power'/>
                            </LogoutButton>
                        </UserWrapper>
                    </Header>

                    <HighlightCards>
                        <HighlightCard 
                            title='Entrada' 
                            amount={highlightData!.entries.amount} 
                            lastTransaction='Última entrada dia 13 de abril'
                            type='up'
                        />

                        <HighlightCard 
                            title='Saídas' 
                            amount={highlightData!.cost.amount}
                            lastTransaction='Última saída dia 03 de abril'
                            type='down'
                        />

                        <HighlightCard 
                            title='Total' 
                            amount={highlightData!.total.amount}
                            lastTransaction='01 à 16 de abril'
                            type='total'
                        />
                    </HighlightCards>

                    <Transactions>
                        <Title>
                            Listagem
                        </Title>
                        <TransactionsList 
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <TransactionCard data={item} />}
                        />

                    </Transactions>
                </>
            }
        </Container>
    )
}