import { useCallback } from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { Checkbox, CheckboxProps } from "react-native-paper"
import { useExtendedTheme } from "../../theme"

type Props = {
	style?: StyleProp<ViewStyle>
	hasError?: boolean
	errorText?: string
	value?: boolean
	onChange?: (value: boolean) => void
	label?: string
} & Omit<CheckboxProps, "status" | "onPress">

export const WWCheckbox = ({
	style,
	hasError,
	value = false,
	onChange,
	disabled,
	label,
	...props
}: Props) => {
	const { colors } = useExtendedTheme()
	const handleChange = useCallback(() => {
		onChange?.(!value)
	}, [onChange, value])

	return (
		<View style={styles.wrapper}>
			<Checkbox.Item
				{...props}
				label={label || ""}
				status={value ? "checked" : "unchecked"}
				onPress={handleChange}
				disabled={disabled}
				color={hasError ? "red" : colors.primary}
				uncheckedColor="#fff"
				style={[styles.container, style]}
				position="leading"
				mode="android"
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		width: "100%",
		alignItems: "flex-start",
	},
	container: {
		borderRadius: 4,
	},
})
