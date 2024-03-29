import { createContext, useContext } from "react"
import { PropsWithChildren } from "react"

import { ReturnType, useReconnectDevice } from "../hooks/useReconnectDevice"

const DeviceReconnectContext = createContext<ReturnType>({} as ReturnType)

export const useReconnect = () => {
	return useContext(DeviceReconnectContext)
}

type Props = {
	deviceId: string
}

export const DeviceReconnectProvider = ({
	children,
	deviceId,
}: PropsWithChildren<Props>) => {
	useReconnectDevice({
		deviceId,
	})

	return children
}
