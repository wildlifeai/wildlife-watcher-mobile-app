import { useState } from "react"
import { useEffect, useRef } from "react"

import Toast from "react-native-toast-message"
import { useBleActions } from "../providers/BleEngineProvider"
import { useAppSelector } from "../redux"
import { useAppNavigation } from "./useAppNavigation"
import { ExtendedPeripheral } from "../redux/slices/devicesSlice"
import { log } from "../utils/logger"

type Props = {
	deviceId: string
	initialTarget?: number
}

export type ReturnType = {
	reconnecting: boolean
	problem?: string
	connected: boolean
}

const INTERVAL = 1000
const CONNECT_TIMEOUT = 5000
const TIMEOUT = 1000 * 18
const REDIRECT_AFTER_RETRIES = 10

export const useReconnectDevice = ({ deviceId }: Props) => {
	const reconnectingRef = useRef<NodeJS.Timeout>()
	const timeoutRef = useRef<NodeJS.Timeout>()
	const retriesRef = useRef(0)

	const { write, connectDevice } = useBleActions()
	const devices = useAppSelector((state) => state.devices)

	const navigation = useAppNavigation()

	const [reconnecting, setReconnecting] = useState(false)
	const [problem, setProblem] = useState<string | undefined>()

	const device = devices[deviceId] as ExtendedPeripheral

	const clearTimers = () => {
		reconnectingRef.current && clearInterval(reconnectingRef.current)
		timeoutRef.current && clearTimeout(timeoutRef.current)
	}

	useEffect(() => {
		const { connected } = device

		/**
		 * Basic loop prevention, if for some reason more then 3 reconnects are detected,
		 * redirect to home screen.
		 */
		if (retriesRef.current >= REDIRECT_AFTER_RETRIES) {
			if (reconnectingRef.current) {
				clearInterval(reconnectingRef.current)
			}
			setReconnecting(false)
			setProblem(
				`${retriesRef.current} attempts to reconnect reached. Stopped trying to reconnect ${device.id}.`,
			)
			log(
				`${retriesRef.current} attempts to reconnect reached. Stopped trying to reconnect ${device.id}.`,
			)
			Toast.show({
				type: "error",
				text1: "Oops",
				text2: `More then ${retriesRef.current} reconnect attempts detected. Redirecting you back to home screen to avoid looping`,
				props: {
					numberOfLines: 2,
				},
			})
			navigation.navigate("Home", { force: true })
			return
		}

		if (connected) {
			setReconnecting(false)
			clearTimers()
			reconnectingRef.current = undefined
			retriesRef.current = 0
			return
		}

		setReconnecting(true)

		if (reconnectingRef.current) return

		retriesRef.current++

		connectDevice(device, CONNECT_TIMEOUT)
		reconnectingRef.current = setInterval(
			() => connectDevice(device, CONNECT_TIMEOUT),
			INTERVAL,
		)
		timeoutRef.current = setTimeout(() => {
			if (reconnectingRef.current) {
				clearInterval(reconnectingRef.current)
			}
			setReconnecting(false)
			setProblem(`Stopped trying to reconnect ${device.id}.`)
			log(`Stopped trying to reconnect ${device.id}.`)
			navigation.navigate("Home", { force: true })
		}, TIMEOUT)
	}, [connectDevice, device, navigation, write])

	useEffect(() => {
		return () => {
			log("Cancelling the reconnect interval.")
			clearTimers()
		}
	}, [])

	const { connected } = device

	return {
		connected,
		problem,
		reconnecting,
	}
}
