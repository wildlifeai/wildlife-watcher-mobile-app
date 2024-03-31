import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { Appbar } from "react-native-paper"
import { getHeaderTitle } from "@react-navigation/elements"
import { StyleSheet } from "react-native"

export const NavigationBar = ({
	navigation,
	route,
	options,
	back,
}: NativeStackHeaderProps) => {
	const title = getHeaderTitle(options, route.name)

	return (
		<Appbar.Header>
			{back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
			<Appbar.Content style={styles.title} title={title} />
		</Appbar.Header>
	)
}

const styles = StyleSheet.create({
	title: {
		alignItems: "center",
	},
})
