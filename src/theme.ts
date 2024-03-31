import { DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native"
import { MD3LightTheme, adaptNavigationTheme } from "react-native-paper"
import merge from "deepmerge"

const { LightTheme } = adaptNavigationTheme({
	reactNavigationLight: NavigationDefaultTheme,
})

export const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme)
