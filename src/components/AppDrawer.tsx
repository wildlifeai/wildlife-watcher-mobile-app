import {
	Dispatch,
	PropsWithChildren,
	createContext,
	useContext,
	useState,
} from "react"
import { StyleSheet } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { Button, Surface } from "react-native-paper"
import { WWText } from "./ui/WWText"
import { useExtendedTheme } from "../theme"

type DrawerContextProps = {
	isOpen: boolean
	setIsOpen: Dispatch<React.SetStateAction<boolean>>
}
const DrawerContext = createContext({} as DrawerContextProps)

export const useAppDrawer = () => useContext(DrawerContext)

export const AppDrawer = ({ children }: PropsWithChildren<unknown>) => {
	const [isOpen, setIsOpen] = useState(false)
	const { padding } = useExtendedTheme()

	return (
		<Drawer
			style={styles.view}
			open={isOpen}
			onOpen={() => setIsOpen(true)}
			onClose={() => setIsOpen(false)}
			renderDrawerContent={() => {
				return (
					<Surface style={[{ padding }, styles.view]}>
						<WWText variant="bodyLarge">I'm empty at the moment.</WWText>
						<Button onPress={() => setIsOpen((prevOpen) => !prevOpen)}>{`${
							isOpen ? "Close" : "Open"
						} drawer`}</Button>
					</Surface>
				)
			}}
		>
			<DrawerContext.Provider value={{ isOpen, setIsOpen }}>
				{children}
			</DrawerContext.Provider>
		</Drawer>
	)
}

const styles = StyleSheet.create({
	view: {
		flex: 1,
	},
})
