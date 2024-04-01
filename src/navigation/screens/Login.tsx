import { Button } from "react-native-paper"
import { StyleSheet, View } from "react-native"
import { CustomKeyboardAvoidingView } from "../../components/CustomKeyboardAvoidingView"
import { useContext } from "react"
import { AuthContext } from "../../providers/AuthProvider"
import { WWTextInput } from "../../components/ui/WWTextInput"
import { WWScreenView } from "../../components/ui/WWScreenView"

export const Login = () => {
	const { setIsLoggedIn } = useContext(AuthContext)

	return (
		<CustomKeyboardAvoidingView>
			<WWScreenView style={[styles.view]}>
				<View style={styles.element}>
					<WWTextInput value="Email" />
				</View>
				<View style={styles.element}>
					<WWTextInput value="Password" />
				</View>
				<View style={styles.elementTwo}>
					<Button mode="contained" onPress={() => setIsLoggedIn(true)}>
						Proceed for now
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
