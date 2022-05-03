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
    lastTransaction: string
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
    const [isLoading, setIsLoading] = useState(true)
    const [transactions, setTransactions] = useState<DataListProps[]>([])
    const [highlightData, setHighlightData] = useState<HighlightData>()

    const theme = useTheme()

    function getLastTransactionDate(
        collection : DataListProps[],
        type: 'positive' | 'negative'
    ) {

        const lastTransaction = new Date(
            Math.max.apply(Math, collection
                .filter(
                    transaction => transaction.type === type
                )
                .map(
                    transaction => new Date(transaction.date).getTime()
                )
            )
        )

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR',{month: 'long'})}`
    }

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

        const lastEntriesDate = getLastTransactionDate(transactionsResponse, 'positive')
        const lastCostDate = getLastTransactionDate(transactionsResponse, 'negative')
        const totalIntervalDate = `01 a ${lastCostDate}`
        
        let total = entriesTotal - costTotal

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última entrada dia ${lastEntriesDate}`
            },
            cost: {
                amount: costTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última saída dia ${lastCostDate}`
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