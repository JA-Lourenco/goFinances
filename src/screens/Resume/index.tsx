import React, { useEffect, useState } from 'react';

import { HistoryCard } from '../../components/HistoryCard'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { categories } from '../../utils/categories';

import { 
  Container, 
  Header, 
  Title,
  Content
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
  total: string
  color: string
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
    
  async function loadData() {
    const dataKey = '@gofinances:transactions'
    const dataStoraged = await AsyncStorage.getItem(dataKey)
    const dataStoragedFormatted = dataStoraged ? JSON.parse(dataStoraged) : []

    const cost = dataStoragedFormatted
      .filter(
        (cost : TransactionData) => cost.type === 'negative'
      )
    
    const totalByCategory: CategoryData[] = []

    categories.forEach(category => {
      let categorySum = 0

      cost.forEach((cost : TransactionData) => {
        if(cost.category === category.key) {
          categorySum += Number(cost.amount)
        }
      })

      if(categorySum > 0) {
        const total = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        totalByCategory.push({
          key: category.key,
          name: category.name,
          total,
          color:category.color
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
        {
          totalByCategories.map(item => 
              <HistoryCard 
                key={item.key}
                title={item.name} 
                amount={item.total} 
                color={item.color}
              />
            )
        }
      </Content>
    </Container>
  );
}
