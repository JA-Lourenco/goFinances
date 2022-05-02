import React, { useEffect, useState } from 'react';

import { HistoryCard } from '../../components/HistoryCard'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { categories } from '../../utils/categories';

import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { BorderlessButtonProps } from 'react-native-gesture-handler';

import { useTheme } from 'styled-components';

import { 
  Container, 
  Header, 
  Title,
  Content,
  CharContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month
} from './styles'

interface TransactionData {
  type: 'positive' | 'negative'
  name: string
  amount: string
  category: string
  date: string
}

interface CategoryData {
  key: string
  name: string
  total: number
  totalFormatted: string
  color: string
  percent: string
}

interface MonthButtonProps extends BorderlessButtonProps {
  onPress: () => void
}

export function Resume({ ...rest } : MonthButtonProps) {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

  const theme = useTheme()
    
  async function loadData() {
    const dataKey = '@gofinances:transactions'
    const dataStoraged = await AsyncStorage.getItem(dataKey)
    const dataStoragedFormatted = dataStoraged ? JSON.parse(dataStoraged) : []

    const cost = dataStoragedFormatted
      .filter(
        (cost : TransactionData) => cost.type === 'negative'
      )

    const costTotal = cost.reduce((acc: number, itemCost: TransactionData) => {
      return acc + Number(itemCost.amount)
    }, 0)
    
    const totalByCategory: CategoryData[] = []

    categories.forEach(category => {
      let categorySum = 0

      cost.forEach((cost : TransactionData) => {
        if(cost.category === category.key) {
          categorySum += Number(cost.amount)
        }
      })

      if(categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        const percent = `${(categorySum / costTotal * 100).toFixed(0)}%`

        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          color:category.color,
          totalFormatted,
          percent
        })
      }
    })

    setTotalByCategories(totalByCategory)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Container>
      <Header>
        <Title>
          Resumo por categoria
        </Title>
      </Header>

      <Content>
        <MonthSelect>
          <MonthSelectButton {...rest}>
            <MonthSelectIcon 
              name='chevron-left'
            />
          </MonthSelectButton>

          <Month>Maio</Month>

          <MonthSelectButton {...rest}>
            <MonthSelectIcon 
              name='chevron-right'
            />
          </MonthSelectButton>
        </MonthSelect>

        <CharContainer>
          <VictoryPie 
            data={totalByCategories}
            colorScale={totalByCategories.map(category => category.color)}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape
              }              
            }}
            labelRadius={100}
            x='percent'
            y='total'
          />
        </CharContainer>

        {
          totalByCategories.map(item => 
              <HistoryCard 
                key={item.key}
                title={item.name} 
                amount={item.totalFormatted} 
                color={item.color}
              />
            )
        }
      </Content>
    </Container>
  );
}
