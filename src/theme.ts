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
		colors: {
			...theme.colors,
			primary: "#4caf50",
			secondary: "#fed54e",
			tertiary: "#ffffff",
		},
		padding: 20,
		roundness: 10,
		spacing: 10,
	}
}

export const CombinedDefaultTheme = merge(
	LightTheme,
	extendThemes({
		...MD3LightTheme,
		colors: {
			...MD3LightTheme.colors,
			primary: "rgb(76, 175, 80)",
			onPrimary: "rgb(255, 255, 255)",
			primaryContainer: "rgb(240, 219, 255)",
			onPrimaryContainer: "rgb(44, 0, 81)",
			secondary: "rgb(254, 213, 78)",
			onSecondary: "rgb(255, 255, 255)",
			secondaryContainer: "rgb(237, 221, 246)",
			onSecondaryContainer: "rgb(33, 24, 42)",
			tertiary: "rgb(255, 255, 255)",
			onTertiary: "rgb(255, 255, 255)",
			tertiaryContainer: "rgb(255, 217, 221)",
			onTertiaryContainer: "rgb(50, 16, 23)",
			error: "rgb(186, 26, 26)",
			onError: "rgb(255, 255, 255)",
			errorContainer: "rgb(255, 218, 214)",
			onErrorContainer: "rgb(65, 0, 2)",
			background: "rgb(38, 38, 43)",
			onBackground: "rgb(255, 255, 255)",
			surface: "rgb(38, 38, 43)",
			onSurface: "rgb(255, 255, 255)",
			surfaceVariant: "rgb(233, 223, 235)",
			onSurfaceVariant: "rgb(74, 69, 78)",
			outline: "rgb(124, 117, 126)",
			outlineVariant: "rgb(204, 196, 206)",
			shadow: "rgb(0, 0, 0)",
			scrim: "rgb(0, 0, 0)",
			inverseSurface: "rgb(50, 47, 51)",
			inverseOnSurface: "rgb(245, 239, 244)",
			inversePrimary: "rgb(220, 184, 255)",
			elevation: {
				level0: "rgb(38, 38, 43)",
				level1: "rgb(38, 38, 43)",
				level2: "rgb(38, 38, 43)",
				level3: "rgb(38, 38, 43)",
				level4: "rgb(38, 38, 43)",
				level5: "rgb(38, 38, 43)",
			},
			surfaceDisabled: "rgba(29, 27, 30, 0.12)",
			onSurfaceDisabled: "rgba(29, 27, 30, 0.38)",
			backdrop: "rgba(51, 47, 55, 0.4)",
		},
	}),
)

export const CombinedDarkTheme = merge(
	extendThemes({
		...MD3DarkTheme,
		colors: {
			...MD3DarkTheme.colors,
		},
	}),
	DarkTheme,
)

export const useExtendedTheme = () =>
	useTheme<typeof CombinedDarkTheme | typeof CombinedDefaultTheme>()
