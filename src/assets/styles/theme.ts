import { DefaultTheme } from "styled-components"

const color = {
  blue:{
    primaryBlue: '#2962ff',
  },
  achromatic:{
    primaryWhite: '#FAFAFA',
    white: '#FFFFFF',
    lightGray: '#e0e0e0',
    darkGray : "#929292",
    black: '#212121',
  },
}

const layout = {
  screenMaxWidth : '975px'
}

export const theme = {
  color,
  layout
}

export type CustomColorTypes = typeof color ;
export type CustomLayoutTypes = typeof layout;