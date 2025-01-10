import { memo, useEffect, useMemo, useCallback, useState } from "react"

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
import { useForm } from "react-hook-form"
import { WWTextInput } from "../../components/ui/WWTextInput"
import { Field } from "../../components/form/Field"
import { useCreateProjectMutation } from "../../redux/api/projects"
import { useCreateDeviceMutation } from "../../redux/api/devices"
import { useCreateDeploymentMutation } from "../../redux/api/deployments"
import { useCreateObservationMutation } from "../../redux/api/observations"
import { useCreateSensorRecordMutation } from "../../redux/api/sensorRecords"
import { useCreateUserMutation } from "../../redux/api/users"
import { ProjectRole } from "../../redux/api/types"
import { WWButton } from "../../components/ui/WWButton"
import { WWSelect } from "../../components/ui/WWSelect"
import { WWLoader } from "../../components/ui/WWLoader"
import { WWCheckbox } from "../../components/ui/WWCheckbox"

type FormData = {
	searchText: string
	searchType: string
	isActive: boolean
}

export const Home = memo(() => {
	const { isBleConnecting, startScan, connectDevice, disconnectDevice } =
		useBleActions()
	const devices = useAppSelector((state) => state.devices)
	const { isScanning } = useAppSelector((state) => state.scanning)
	const navigation = useAppNavigation()
	const { bottom } = useSafeAreaInsets()
	const isFocused = useIsFocused()
	const [isLoading, setIsLoading] = useState(false)
	const { control, handleSubmit, setError } = useForm<FormData>({
		defaultValues: {
			searchText: "",
			searchType: "project",
			isActive: false,
		},
	})

	const [createProject] = useCreateProjectMutation()
	const [createDeployment] = useCreateDeploymentMutation()
	const [createDevice] = useCreateDeviceMutation()
	const [createObservation] = useCreateObservationMutation()
	const [createSensorRecord] = useCreateSensorRecordMutation()
	const [createUser] = useCreateUserMutation()

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

	const onSubmit = async (data: FormData) => {
		setIsLoading(true)

		try {
			const userResult = await createUser({
				userId: "firstuser",
				name: "Test User",
				email: "miha@wildlife.ai",
				profilePicUrl:
					"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
				membershipProjects: [],
			}).unwrap()
			console.log("User created:", userResult)

			const projectResult = await createProject({
				projectId: "test-project-id",
				projectTeam: [
					{
						userId: "test-user-id",
						role: ProjectRole.Owner,
					},
				],
				title: data.searchText,
				description: "Test project",
				acronym: "TEST",
				samplingDesign: "Test sampling design",
				captureMethod: "Test capture method",
				individualAnimals: 100,
				observationLevel: "Test observation level",
				projectPrivacy: "Test project privacy",
			}).unwrap()
			console.log("Project created:", projectResult)

			const deploymentResult = await createDeployment({
				deploymentId: "test-deployment-id",
				locationName: "Test Location",
				projectId: "test-project-id",
				latitude: 0,
				longitude: 0,
				deploymentStart: new Date().toISOString(),
				deploymentEnd: new Date().toISOString(),
				setupBy: "Test User",
			}).unwrap()
			console.log("Deployment created:", deploymentResult)

			const deviceResult = await createDevice({
				deviceType: "Test Device",
				deviceModel: "Test Model",
			}).unwrap()
			console.log("Device created:", deviceResult)

			const observationResult = await createObservation({
				observationId: "test-deployment-id",
				mediaID: "test-media-id",
				eventID: "test-event",
				eventStart: new Date().toISOString(),
				eventEnd: new Date().toISOString(),
				observationLevel: "Test Level",
				observationType: "Test Type",
				scientificName: "Test Species",
				count: 1,
			}).unwrap()
			console.log("Observation created:", observationResult)

			const sensorResult = await createSensorRecord({
				sensorRecordID: "test-deployment-id",
				provider: "Test Provider",
				sensor_id: "test-sensor",
				mediaID: "test-media-id",
				date: new Date().toISOString(),
				submissionDate: new Date().toISOString(),
				status: "active",
				network: "test-network",
				gateway: "test-gateway",
				rssi: -70,
				sequence: 1,
				counter: 1,
				battery_voltage: 3.3,
				deviceMemoryAvailable: 1000,
				snr: 10,
				timeout: 30,
			}).unwrap()
			console.log("Sensor record created:", sensorResult)
		} catch (error) {
			console.log("error", error)
			setError("searchText", {
				type: "manual",
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<WWScreenView>
			<View style={[styles.wrapper, { paddingBottom: bottom }]}>
				{/* <StatusBar barStyle="light-content" backgroundColor="#ffffff" /> */}
				<View style={styles.headerView}>
					<View style={styles.buttonRow}>
						<WWButton
							hasError={true}
							mode="contained"
							onPress={scan}
							loading={isScanning}
						>
							{isScanning ? "Scanning" : "Scan"}
						</WWButton>
					</View>
				</View>
				{isLoading ? (
					<WWLoader />
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
								disabled={isAnyDeviceConnecting}
								item={item}
								disconnect={disconnect}
								go={go}
							/>
						)}
						keyExtractor={(item: ExtendedPeripheral) => item.id}
					/>
				)}
				<View>
					<Field
						control={control}
						name="searchText"
						label="Text input"
						required
						rules={{
							required: "Search text is required",
							minLength: {
								value: 3,
								message: "Search text must be at least 3 characters",
							},
						}}
					>
						{(field) => <WWTextInput {...field} mode="outlined" />}
					</Field>
					<Field control={control} name="searchType" label="Select">
						{(field) => (
							<WWSelect
								{...field}
								label="Search Type"
								options={[
									{ label: "Project", value: "project" },
									{ label: "Device", value: "device" },
									{ label: "Deployment", value: "deployment" },
									{ label: "Observation", value: "observation" },
								]}
							/>
						)}
					</Field>
					<Field control={control} name="isActive" label="Checkbox">
						{(field) => <WWCheckbox {...field} label="Is Active" />}
					</Field>
					<WWButton onPress={handleSubmit(onSubmit)} mode="contained">
						Submit button
					</WWButton>
				</View>
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
	button: {
		marginTop: 10,
		width: "100%",
	},
})
