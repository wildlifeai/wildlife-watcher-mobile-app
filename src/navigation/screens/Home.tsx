import * as React from "react"
import { memo } from "react"
import { useEffect } from "react"
import { useMemo } from "react"
import { useCallback } from "react"

import {
	FlatList,
	Keyboard,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAppNavigation } from "../../hooks/useAppNavigation"
import { useBleActions } from "../../providers/BleEngineProvider"
import { useAppSelector } from "../../redux"
import { ExtendedPeripheral } from "../../redux/slices/devicesSlice"
import { DeviceItem } from "../../components/DeviceItem"
import { ActivityIndicator, Button } from "react-native-paper"
import { WWText } from "../../components/ui/WWText"

export const Home = memo(() => {
	const { startScan, connectDevice, disconnectDevice } = useBleActions()
	const devices = useAppSelector((state) => state.devices)
	const scanning = useAppSelector((state) => state.scanning)
	const navigation = useAppNavigation()
	const { bottom } = useSafeAreaInsets()

	const devicesToDisplay = useMemo(() => {
		return Object.values(devices).sort((a, b) => {
			if (a.rssi && b.rssi) {
				if (b.rssi === 127 || a.rssi === 127) return -1
				return b.rssi - a.rssi
			}
			return -1
		})
	}, [devices])

	const connect = React.useCallback(
		async (item: ExtendedPeripheral) => {
			await connectDevice(item)
		},
		[connectDevice],
	)

	const disconnect = useCallback(
		async (item: ExtendedPeripheral) => {
			await disconnectDevice(item)
		},
		[disconnectDevice],
	)

	const go = useCallback(
		async (item: ExtendedPeripheral) => {
			if (item.connected || (await connectDevice(item)).connected) {
				navigation.navigate("DeviceNavigator", { deviceId: item.id })
			}
		},
		[connectDevice, navigation],
	)

	useEffect(() => {
		startScan()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<View style={[styles.wrapper, { paddingBottom: bottom }]}>
				{/* <StatusBar barStyle="light-content" backgroundColor="#ffffff" /> */}
				<View style={styles.headerView}>
					<View style={styles.buttonRow}>
						<Button
							mode="contained"
							onPress={() => startScan()}
							disabled={scanning.isScanning}
						>
							Scan
						</Button>
					</View>
				</View>
				{scanning.isScanning ? (
					<View style={styles.loader}>
						<ActivityIndicator size={30} />
						<WWText style={styles.text}>Scanning...</WWText>
					</View>
				) : devicesToDisplay.length < 1 ? (
					<View style={styles.emptyView}>
						<WWText>No devices found.</WWText>
					</View>
				) : (
					<FlatList
						contentContainerStyle={styles.list}
						data={devicesToDisplay}
						renderItem={({ item }: { item: ExtendedPeripheral }) => (
							<DeviceItem
								item={item}
								connect={connect}
								disconnect={disconnect}
								go={go}
							/>
						)}
						keyExtractor={(item: ExtendedPeripheral) => item.id}
					/>
				)}
			</View>
		</TouchableWithoutFeedback>
	)
})

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	headerView: {
		margin: 15,
		marginTop: 0,
		alignItems: "center",
	},
	list: {
		padding: 15,
	},
	searchbar: {
		marginVertical: 15,
		shadowColor: "transparent",
		borderWidth: 1,
	},
	buttonRow: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	emptyView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	reverse: { flexDirection: "row-reverse", flex: 1 },
	filter: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	filterWWText: {
		fontSize: 15,
		fontWeight: "700",
	},
	loader: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		marginTop: 10,
		alignItems: "center",
	},
})
