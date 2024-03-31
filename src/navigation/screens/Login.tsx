import { Button } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { StyleSheet, View } from "react-native"
import { CustomKeyboardAvoidingView } from "../../components/CustomKeyboardAvoidingView"
import { useContext } from "react"
import { AuthContext } from "../../providers/AuthProvider"
import { useExtendedTheme } from "../../theme"
import { WWTextInput } from "../../components/ui/WWTextInput"

export const Login = () => {
	const { setIsLoggedIn } = useContext(AuthContext)
	const { padding } = useExtendedTheme()

	return (
		<CustomKeyboardAvoidingView>
			<SafeAreaView style={[{ padding }, styles.view]}>
				<View style={styles.element}>
					<WWTextInput value="Email" />
				</View>
				<View style={styles.element}>
					<WWTextInput value="Passwrod" />
				</View>
				<View style={styles.elementTwo}>
					<Button mode="contained" onPress={() => setIsLoggedIn(true)}>
						Proceed for now
					</Button>
				</View>
			</SafeAreaView>
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
