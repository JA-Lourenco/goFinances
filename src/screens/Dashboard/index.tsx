import React, { useCallback, useEffect, useState } from 'react'

import { ActivityIndicator } from 'react-native'

import { useFocusEffect } from '@react-navigation/native'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { useTheme } from 'styled-components'
import { useAuth } from '../../hooks/auth'

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
    lastTransaction: string
}

interface HighlightData {
    entries: HighlightProps
    cost: HighlightProps
    total: HighlightProps
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true)
    const [transactions, setTransactions] = useState<DataListProps[]>([])
    const [highlightData, setHighlightData] = useState<HighlightData>()

    const theme = useTheme()
    const { signOut, user } = useAuth()

    function getLastTransactionDate(
        collection : DataListProps[],
        type: 'positive' | 'negative'
    ) {
        const collectionFiltered = collection.filter(
            transaction => transaction.type === type
        )

        if(collectionFiltered.length === 0) {
            return 0
        }

        const lastTransaction = new Date(
            Math.max.apply(Math, collectionFiltered.map(
                    transaction => new Date(transaction.date).getTime()
                )
            )
        )

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR',{month: 'long'})}`
    }

    async function loadTransactions() {
        const dataKey = `gofinances:transactions_user:${user.id}`
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

        const lastEntriesDate = getLastTransactionDate(transactionsResponse, 'positive')
        const lastCostDate = getLastTransactionDate(transactionsResponse, 'negative')

        const totalIntervalDate = lastCostDate === 0 
        ? `Não há transações`
        : `01 a ${lastCostDate}`
        
        let total = entriesTotal - costTotal

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastEntriesDate === 0 
                ? `Não há transações` 
                : `Última entrada dia ${lastEntriesDate}`
            },
            cost: {
                amount: costTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastCostDate === 0 
                ? `Não há transações`
                : `Última saída dia ${lastCostDate}`
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalIntervalDate
            }
        })

        setIsLoading(false)
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
                                    source={{uri: user.photo}}
                                />
                                
                                <User>
                                    <UserGreeting>Olá,</UserGreeting>
                                    <UserName>{user.name}</UserName>
                                </User>
                            </UserInfo>

                            <LogoutButton onPress={signOut}>
                                <Icon name='power'/>
                            </LogoutButton>
                        </UserWrapper>
                    </Header>

                    <HighlightCards>
                        <HighlightCard 
                            title='Entrada' 
                            amount={highlightData!.entries.amount} 
                            lastTransaction={highlightData!.entries.lastTransaction}
                            type='up'
                        />

                        <HighlightCard 
                            title='Saídas' 
                            amount={highlightData!.cost.amount}
                            lastTransaction={highlightData!.cost.lastTransaction}
                            type='down'
                        />

                        <HighlightCard 
                            title='Total' 
                            amount={highlightData!.total.amount}
                            lastTransaction={highlightData!.total.lastTransaction}
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