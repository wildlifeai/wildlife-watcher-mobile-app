import { forwardRef } from "react"
import { StyleSheet, View } from "react-native"
import { ProgressBar, ProgressBarProps } from "react-native-paper"
import { useExtendedTheme } from "../../theme"
import { WWText } from "./WWText"

type Props = ProgressBarProps & {
	showLabel?: boolean
	label?: string
}

export const WWProgressBar = forwardRef<View, Props>(
	({ showLabel, label, progress = 0, style, ...props }, ref) => {
		const { colors } = useExtendedTheme()
		const percentage = Math.round(progress * 100)

		return (
			<View style={styles.container} ref={ref}>
				{showLabel && (
					<WWText variant="bodyMedium" style={styles.label}>
						{label || `Progress: ${percentage}%`}
					</WWText>
				)}
				<ProgressBar
					{...props}
					progress={progress}
					color={colors.primary}
					style={[styles.progressBar, style]}
				/>
			</View>
		)
	},
)

const styles = StyleSheet.create({
	container: {
		width: "100%",
		gap: 8,
	},
	label: {
		textAlign: "center",
	},
	progressBar: {
		height: 6,
		borderRadius: 3,
	},
})
