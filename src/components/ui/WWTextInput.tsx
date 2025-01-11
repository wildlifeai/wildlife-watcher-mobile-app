import { forwardRef, useCallback } from "react"
import { TextInput as RNTextInput } from "react-native"
import { TextInput as RNPTextInput, TextInputProps } from "react-native-paper"
import { StyleSheet, View } from "react-native"
import { WWText } from "./WWText"

type CommonProps = {
	multiline?: boolean
	hasError?: boolean
	onChange?: (value: string) => void
	errorText?: string
}

export type WWTextInputProps = CommonProps & Omit<TextInputProps, "onChange">

export const WWTextInput = forwardRef<RNTextInput, WWTextInputProps>(
	(
		{
			multiline,
			hasError,
			onChange,
			value,
			style,
			disabled,
			errorText,
			...props
		},
		ref,
	) => {
		const innerOnChange = useCallback(
			(text: string) => {
				onChange?.(text)
			},
			[onChange],
		)

		const sanitizedValue = value ?? ""

		return (
			<View style={styles.container}>
				<RNPTextInput
					{...props}
					ref={ref}
					multiline={multiline}
					disabled={disabled}
					error={hasError}
					value={sanitizedValue}
					onChangeText={innerOnChange}
					style={[styles.input, style]}
					right={
						disabled ? (
							<RNPTextInput.Icon icon="lock" />
						) : hasError ? (
							<RNPTextInput.Icon icon="alert-circle" color="red" />
						) : null
					}
				/>
				{hasError && errorText && (
					<WWText style={styles.errorText}>{errorText}</WWText>
				)}
			</View>
		)
	},
)

const styles = StyleSheet.create({
	container: {
		width: "100%",
		margin: 0,
	},
	input: {
		width: "100%",
		marginVertical: 0,
	},
	errorText: {
		color: "red",
		fontSize: 12,
		marginTop: 4,
	},
})
