import { memo, useEffect, useMemo, useCallback } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAppNavigation } from "../../hooks/useAppNavigation"
import { useBleActions } from "../../providers/BleEngineProvider"
import { useAppSelector } from "../../redux"
import { ExtendedPeripheral } from "../../redux/slices/devicesSlice"
import { DeviceItem } from "../../components/DeviceItem"
import { WWText } from "../../components/ui/WWText"
import { WWScreenView } from "../../components/ui/WWScreenView"
import { log } from "../../utils/logger"
import { useIsFocused } from "@react-navigation/native"
import { WWButton } from "../../components/ui/WWButton"
import { WWLoader } from "../../components/ui/WWLoader"
import {
	useGetDeploymentsQuery,
	useCreateDeploymentMutation,
} from "../../redux/api/deployments"
import { DeploymentCard } from "../../components/DeploymentCard"

export const Home = memo(() => {
	const { isBleConnecting, startScan, connectDevice, disconnectDevice } =
		useBleActions()
	const devices = useAppSelector((state) => state.devices)
	const { isScanning } = useAppSelector((state) => state.scanning)
	const navigation = useAppNavigation()
	const { bottom } = useSafeAreaInsets()
	const isFocused = useIsFocused()
	const { data: deployments, isLoading } = useGetDeploymentsQuery()
	const [createDeployment] = useCreateDeploymentMutation()

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

	const upgrade = useCallback(
		(item: ExtendedPeripheral) => {
			navigation.navigate("DfuScreen", { deviceId: item.id })
		},
		[navigation],
	)

	const scan = () => {
		if (!isBleBusy && !isScanning) {
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

	const handleDeploymentPress = (deploymentId: string) => {
		console.log(`pressed deployment ${deploymentId}`)
	}

	const handleAddDeployment = async () => {
		try {
			const result = await createDeployment({
				data: {
					deploymentID: Math.random().toString(36).substring(2, 10),
					locationName: "Test Location",
					locationID: "3",
					latitude: 45.4215,
					longitude: -75.6972,
					deploymentStart: new Date().toISOString(),
					deploymentEnd: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
					setupBy: "Test User",
				},
			}).unwrap()
			console.log("Deployment created:", result)
		} catch (error) {
			console.error("Failed to create deployment:", error)
		}
	}

	return (
		<WWScreenView scrollable>
			<View style={[styles.wrapper, { paddingBottom: bottom }]}>
				<View style={styles.headerView}>
					<View style={styles.buttonRow}>
						<WWButton mode="contained" onPress={scan} loading={isScanning}>
							{isScanning ? "Scanning" : "Scan"}
						</WWButton>
					</View>
				</View>

				{/* Devices List */}
				{devicesToDisplay.length > 0 && (
					<View style={styles.section}>
						<WWText variant="titleLarge" style={styles.sectionTitle}>
							Devices
						</WWText>
						<FlatList
							contentContainerStyle={styles.devicesList}
							data={devicesToDisplay}
							renderItem={({ item }: { item: ExtendedPeripheral }) => (
								<DeviceItem
									disabled={isAnyDeviceConnecting}
									item={item}
									disconnect={disconnect}
									go={go}
									upgrade={upgrade}
								/>
							)}
							keyExtractor={(item: ExtendedPeripheral) => item.id}
						/>
					</View>
				)}

				{/* Deployments List */}
				<View style={styles.section}>
					<WWText variant="titleLarge" style={styles.sectionTitle}>
						Deployments
					</WWText>
					{isLoading ? (
						<WWLoader />
					) : deployments && deployments.length > 0 ? (
						<View style={styles.list}>
							{deployments.map((deployment) => {
								console.log("Deployment:", deployment)
								return (
									<DeploymentCard
										key={deployment.id}
										deployment={deployment}
										onPress={handleDeploymentPress}
									/>
								)
							})}
						</View>
					) : (
						<View style={styles.emptyView}>
							<WWText>No deployments found.</WWText>
						</View>
					)}
				</View>

				<WWButton
					mode="contained"
					style={styles.addButton}
					onPress={handleAddDeployment}
				>
					Add new deployment
				</WWButton>
			</View>
		</WWScreenView>
	)
})

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	headerView: {
		marginBottom: 16,
		alignItems: "center",
	},
	buttonRow: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		marginBottom: 16,
	},
	devicesList: {
		gap: 8,
	},
	list: {
		flex: 1,
	},
	emptyView: {
		padding: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	addButton: {
		marginTop: 16,
		backgroundColor: "#4CAF50",
	},
})
