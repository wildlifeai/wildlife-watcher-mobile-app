import {
	Dispatch,
	PropsWithChildren,
	createContext,
	useContext,
	useState,
} from "react"
import { StyleSheet, View } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { Button } from "react-native-paper"

type DrawerContextProps = {
	isOpen: boolean
	setIsOpen: Dispatch<React.SetStateAction<boolean>>
}
const DrawerContext = createContext({} as DrawerContextProps)

export const useAppDrawer = () => useContext(DrawerContext)

export const AppDrawer = ({ children }: PropsWithChildren<unknown>) => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Drawer
			style={styles.view}
			open={isOpen}
			onOpen={() => setIsOpen(true)}
			onClose={() => setIsOpen(false)}
			renderDrawerContent={() => {
				return (
					<View>
						<Button onPress={() => setIsOpen((prevOpen) => !prevOpen)}>{`${
							isOpen ? "Close" : "Open"
						} drawer`}</Button>
					</View>
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
