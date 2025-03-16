import { PropsWithChildren } from "react"
import {
	Keyboard,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	ViewProps,
} from "react-native"
import { useExtendedTheme } from "../../theme"

type Props = PropsWithChildren<ViewProps> & {
	scrollable?: boolean
}

export const WWScreenView = ({
	children,
	scrollable = true,
	...props
}: Props) => {
	const { appPadding } = useExtendedTheme()

	return (
		<TouchableWithoutFeedback style={styles.view} onPress={Keyboard.dismiss}>
			<View style={[{ padding: appPadding }, styles.view, props.style]}>
				{scrollable ? (
					<ScrollView
						style={styles.scrollView}
						contentContainerStyle={styles.scrollContent}
						keyboardShouldPersistTaps="handled"
					>
						{children}
					</ScrollView>
				) : (
					<View style={styles.view}>{children}</View>
				)}
			</View>
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
