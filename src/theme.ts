import {
	DefaultTheme as NavigationDefaultTheme,
	DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native"
import {
	MD3DarkTheme,
	MD3LightTheme,
	MD3Theme,
	adaptNavigationTheme,
	useTheme,
} from "react-native-paper"
import merge from "deepmerge"

const { LightTheme, DarkTheme } = adaptNavigationTheme({
	reactNavigationLight: NavigationDefaultTheme,
	reactNavigationDark: NavigationDarkTheme,
})

const extendThemes = (theme: MD3Theme) => {
	return {
		...theme,
		padding: 20,
		roundness: 10,
		spacing: 10,
	}
}

export const CombinedDefaultTheme = merge(
	extendThemes(MD3LightTheme),
	LightTheme,
)
export const CombinedDarkTheme = merge(extendThemes(MD3DarkTheme), DarkTheme)

export const useExtendedTheme = () =>
	useTheme<typeof CombinedDarkTheme | typeof CombinedDefaultTheme>()
