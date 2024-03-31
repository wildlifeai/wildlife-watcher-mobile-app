import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { Appbar } from "react-native-paper"
import { getHeaderTitle } from "@react-navigation/elements"
import { StyleSheet } from "react-native"
import { useContext } from "react"
import { AuthContext } from "../providers/AuthProvider"

export const NavigationBar = ({
	navigation,
	route,
	options,
	back,
}: NativeStackHeaderProps) => {
	const title = getHeaderTitle(options, route.name)
	const { setIsLoggedIn } = useContext(AuthContext)

	return (
		<Appbar.Header>
			{back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
			{title && <Appbar.Content style={styles.title} title={title} />}
			{setIsLoggedIn && (
				<Appbar.Action icon="logout" onPress={() => setIsLoggedIn(false)} />
			)}
		</Appbar.Header>
	)
}

const styles = StyleSheet.create({
	title: {
		alignItems: "center",
	},
})
