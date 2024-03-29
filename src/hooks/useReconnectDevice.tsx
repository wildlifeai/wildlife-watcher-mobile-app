import { useEffect } from "react"

import { useAppNavigation } from "./useAppNavigation"
import { log } from "../utils/logger"
import { useSelectDevice } from "./useSelectDevice"

type Props = {
	deviceId: string
	initialTarget?: number
}

export type ReturnType = {
	connected: boolean
}

export const useReconnectDevice = ({ deviceId }: Props) => {
	const device = useSelectDevice({ deviceId })
	const navigation = useAppNavigation()

	useEffect(() => {
		const { connected } = device

		if (!connected) {
			log("Device disconnected, navigating to the Home screen.")
			navigation.navigate("Home")
		}
	}, [device, navigation])
}
