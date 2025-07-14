import { LightThemeColors, DarkThemeColors } from './colors';
import { Typography } from './typography';
import { Spacing } from './spacing';

export const lightTheme = { 
  colors: LightThemeColors, 
  typography: Typography, 
  spacing: Spacing 
};

export const darkTheme = { 
  colors: DarkThemeColors, 
  typography: Typography, 
  spacing: Spacing 
};

export type Theme = typeof lightTheme;
export type ThemeColors = typeof LightThemeColors;
export type ThemeTypography = typeof Typography;
export type ThemeSpacing = typeof Spacing;