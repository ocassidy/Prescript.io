import color from 'color';
import { black, white, pinkA400 } from 'react-native-paper';
import {configureFonts} from 'react-native-paper';

const CustomTheme = {
  dark: false,
  roundness: 4,
  colors: {
    primary: '#44a2ff',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: white,
    error: '#B00020',
    text: black,
    onBackground: '#000000',
    onSurface: '#000000',
    disabled: color(black)
      .alpha(0.26)
      .rgb()
      .string(),
    placeholder: color(black)
      .alpha(0.54)
      .rgb()
      .string(),
    backdrop: color(black)
      .alpha(0.5)
      .rgb()
      .string(),
    notification: pinkA400,
  },
  fonts: {
    light: 'Roboto',
  },
  animation: {
    scale: 1.0,
  },
};

export default CustomTheme;