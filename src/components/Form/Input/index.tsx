import React from 'react'

import { 
    Container 
} from './styles'

import { TextInputProps } from 'react-native'

// type Props = TextInputProps

export function Input({ ...rest } : TextInputProps) {
    return (
        <Container {...rest}>
            
        </Container>
    )
}