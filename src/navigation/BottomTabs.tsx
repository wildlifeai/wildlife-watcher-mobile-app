import { useState } from "react"
import { BottomNavigation } from "react-native-paper"
import { Deployments } from "./screens/Deployments"
import { Maps } from "./screens/Maps"
import { Projects } from "./screens/Projects"
import { Devices } from "./screens/Devices"
import { useExtendedTheme } from "../theme"

export const BottomTabs = () => {
	const [index, setIndex] = useState(2) // Start with Deployment tab active
	const { colors } = useExtendedTheme()

	const routes = [
		{
			key: "maps",
			title: "Maps",
			focusedIcon: "map",
			unfocusedIcon: "map-outline",
		},
		{
			key: "projects",
			title: "Projects",
			focusedIcon: "folder",
			unfocusedIcon: "folder-outline",
		},
		{
			key: "deployment",
			title: "Deployment",
			focusedIcon: "upload",
			unfocusedIcon: "upload-outline",
		},
		{
			key: "devices",
			title: "Devices",
			focusedIcon: "devices",
			unfocusedIcon: "devices",
		},
	]

	const renderScene = BottomNavigation.SceneMap({
		maps: Maps,
		projects: Projects,
		deployment: Deployments,
		devices: Devices,
	})

	return (
		<BottomNavigation
			navigationState={{ index, routes }}
			onIndexChange={setIndex}
			renderScene={renderScene}
			activeColor={colors.primary}
			barStyle={{ backgroundColor: colors.background }}
			theme={{
				colors: {
					secondaryContainer: colors.background,
				},
			}}
		/>
	)
}
