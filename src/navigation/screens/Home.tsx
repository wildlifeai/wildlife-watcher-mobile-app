import { memo, useEffect, useMemo, useCallback } from "react"

import { FlatList, StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAppNavigation } from "../../hooks/useAppNavigation"
import { useBleActions } from "../../providers/BleEngineProvider"
import { useAppSelector } from "../../redux"
import { ExtendedPeripheral } from "../../redux/slices/devicesSlice"
import { DeviceItem } from "../../components/DeviceItem"
import { Button } from "react-native-paper"
import { WWText } from "../../components/ui/WWText"
import { WWScreenView } from "../../components/ui/WWScreenView"
import { log } from "../../utils/logger"
import { useIsFocused } from "@react-navigation/native"

export const Home = memo(() => {
	const { isBleConnecting, startScan, connectDevice, disconnectDevice } =
		useBleActions()
	const devices = useAppSelector((state) => state.devices)
	const { isScanning } = useAppSelector((state) => state.scanning)
	const navigation = useAppNavigation()
	const { bottom } = useSafeAreaInsets()
	const isFocused = useIsFocused()

	const isBleBusy = isBleConnecting || isScanning

	const devicesToDisplay = useMemo(() => {
		return Object.values(devices)
			.sort((a, b) => {
				if (a.rssi && b.rssi) {
					if (b.rssi === 127 || a.rssi === 127) return -1
					return b.rssi - a.rssi
				}
				return -1
			})
			.filter((device) => !device.signalLost)
	}, [devices])

	const isAnyDeviceConnecting = useMemo(() => {
		return !!Object.values(devices).find((device) => device.loading)
	}, [devices])

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

	const scan = () => {
		if (!isBleBusy) {
			startScan()
		} else {
			log("Scanning already taking place, skipping.")
		}
	}

	useEffect(() => {
		if (isFocused) {
			startScan(10)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFocused])

	useEffect(() => {
		if (!isFocused) return

		const interval = setInterval(() => {
			if (!isBleBusy && isFocused) {
				startScan(10)
			} else {
				log("Scanning already taking place, skipping.")
			}
		}, 15 * 1000)

		return () => {
			log("Clearing interval.")
			clearInterval(interval)
		}
	}, [isScanning, isBleConnecting, isBleBusy, startScan, isFocused])

	return (
		<WWScreenView>
			<View style={[styles.wrapper, { paddingBottom: bottom }]}>
				{/* <StatusBar barStyle="light-content" backgroundColor="#ffffff" /> */}
				<View style={styles.headerView}>
					<View style={styles.buttonRow}>
						<Button mode="contained" onPress={scan} loading={isScanning}>
							{isScanning ? "Scanning" : "Scan"}
						</Button>
					</View>
				</View>
				{devicesToDisplay.length < 1 ? (
					<View style={styles.emptyView}>
						<WWText>No devices found.</WWText>
					</View>
				) : (
					<FlatList
						contentContainerStyle={styles.list}
						data={devicesToDisplay}
						renderItem={({ item }: { item: ExtendedPeripheral }) => (
							<DeviceItem
								disabled={isAnyDeviceConnecting}
								item={item}
								disconnect={disconnect}
								go={go}
							/>
						)}
						keyExtractor={(item: ExtendedPeripheral) => item.id}
					/>
				)}
			</View>
		</WWScreenView>
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
