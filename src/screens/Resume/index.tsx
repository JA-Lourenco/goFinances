import React, { useEffect, useState, useCallback } from 'react';

import { HistoryCard } from '../../components/HistoryCard'

import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { categories } from '../../utils/categories';

import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { useTheme } from 'styled-components';
import { useFocusEffect } from '@react-navigation/native';

import { 
  Container, 
  Header, 
  Title,
  Content,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  ChartContainer,
  LoadContainer
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

export function Resume() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

  const theme = useTheme()

  function handleChangedDate(action: 'next' | 'prev') {
    setIsLoading(true)
    if(action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1))
    }
    else if (action === 'prev'){
      setSelectedDate(subMonths(selectedDate, 1))
    }
  }
    
  async function loadData() {
    const dataKey = '@gofinances:transactions'
    const dataStoraged = await AsyncStorage.getItem(dataKey)
    const dataStoragedFormatted = dataStoraged ? JSON.parse(dataStoraged) : []

    const cost = dataStoragedFormatted
      .filter(
        (cost : TransactionData) => 
          cost.type === 'negative' && 
          new Date(cost.date).getMonth() === selectedDate.getMonth() &&
          new Date(cost.date).getFullYear() === selectedDate.getFullYear()
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
    setIsLoading(false)
  }

  useFocusEffect(useCallback(() => {
    loadData()
  }, [selectedDate]))

  return (
    <Container>
      <Header>
        <Title>
          Resumo por categoria
        </Title>
      </Header>
      {        
        isLoading ?
        <LoadContainer>
            <ActivityIndicator 
                color={theme.colors.primary} 
                size='large'
            />
        </LoadContainer> :
        <Content>
          <MonthSelect>
            <MonthSelectButton 
              onPress={() => handleChangedDate('prev')}
            >
              <MonthSelectIcon 
                name='chevron-left'
              />
            </MonthSelectButton>

            <Month>
              {
                format(
                  selectedDate, 
                  'MMMM, yyyy', 
                  {locale: ptBR}
                )
              }
            </Month>

            <MonthSelectButton 
              onPress={() => handleChangedDate('next')}
            >
              <MonthSelectIcon 
                name='chevron-right'
              />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
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
          </ChartContainer>

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
      }
    </Container>
  );
}
