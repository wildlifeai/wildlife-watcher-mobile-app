import { PropsWithChildren } from "react"
import {
	Keyboard,
	ScrollView,
	ScrollViewProps,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	ViewProps,
} from "react-native"
import { useExtendedTheme } from "../../theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Props = PropsWithChildren<ViewProps | ScrollViewProps> & {
	scrollable?: boolean
}

export const WWScreenView = ({
	children,
	scrollable = true,
	...props
}: Props) => {
	const { appPadding } = useExtendedTheme()
	const { bottom } = useSafeAreaInsets()

	return (
		<TouchableWithoutFeedback style={styles.view} onPress={Keyboard.dismiss}>
			{scrollable ? (
				<ScrollView
					style={[styles.scrollView, props.style]}
					contentContainerStyle={[
						{ padding: appPadding, paddingBottom: appPadding + bottom },
						styles.scrollContent,
					]}
					keyboardShouldPersistTaps="handled"
				>
					{children}
				</ScrollView>
			) : (
				<View
					style={[
						{ padding: appPadding, paddingBottom: appPadding + bottom },
						styles.view,
						props.style,
					]}
				>
					{children}
				</View>
			)}
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	view: { flex: 1 },
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		minHeight: "100%",
	},
})
