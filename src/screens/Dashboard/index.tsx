import React from 'react'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'
import { BorderlessButtonProps } from 'react-native-gesture-handler'

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
} from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string
}

interface LogoutButtonProps extends BorderlessButtonProps {
    onPress: () => void
}

export function Dashboard({ ...rest } : LogoutButtonProps) {
    const data: DataListProps[] = [
        {
            id: '1',
            type: 'positive',
            title: 'Desenvolvimento de site',
            amount: 'R$ 12.000,00',
            category: {
                name: 'Vendas',
                icon: 'dollar-sign'
            },
            date: '13/04/2020'
        },
        {
            id: '2',
            type: 'negative',
            title: 'Hamburgueria Pizzy',
            amount: 'R$ 59,00',
            category: {
                name: 'Alimentação',
                icon: 'coffee'
            },
            date: '10/04/2020'
        },
        {
            id: '3',
            type: 'negative',
            title: 'Aluguel do apartamento',
            amount: 'R$ 1.200,00',
            category: {
                name: 'Casa',
                icon: 'home'
            },
            date: '10/04/2020'
        }
    ]

    return (
        <Container>
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
                    amount='R$ 17.400,00' 
                    lastTransaction='Última entrada dia 13 de abril'
                    type='up'
                />

                <HighlightCard 
                    title='Saídas' 
                    amount='R$ 1.259,00' 
                    lastTransaction='Última saída dia 03 de abril'
                    type='down'
                />

                <HighlightCard 
                    title='Total' 
                    amount='R$ 16.141,00' 
                    lastTransaction='01 à 16 de abril'
                    type='total'
                />
            </HighlightCards>

            <Transactions>
                <Title>
                    Listagem
                </Title>
                <TransactionsList 
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />

                </Transactions>
        </Container>
    )
}