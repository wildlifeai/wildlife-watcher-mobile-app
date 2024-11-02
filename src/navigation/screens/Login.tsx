import { Button } from "react-native-paper"
import { StyleSheet, View } from "react-native"
import { CustomKeyboardAvoidingView } from "../../components/CustomKeyboardAvoidingView"
import { WWScreenView } from "../../components/ui/WWScreenView"
import { login } from "../../redux/slices/authSlice"
import { useAppDispatch } from "../../redux"

export const Login = () => {
	const dispatch = useAppDispatch()
	const loginPressed = () => dispatch(login())

	return (
		<CustomKeyboardAvoidingView>
			<WWScreenView style={[styles.view]}>
				<View style={styles.elementTwo}>
					<Button mode="contained" onPress={loginPressed}>
						Login with Azure
					</Button>
				</View>
			</WWScreenView>
		</CustomKeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	view: {
		flex: 1,
		justifyContent: "center",
	},
	element: {
		marginVertical: 10,
	},
	elementTwo: {
		marginVertical: 20,
	},
})
