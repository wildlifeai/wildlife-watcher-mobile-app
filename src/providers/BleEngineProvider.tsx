import * as React from "react"
import { createContext, useContext } from "react"
import { PropsWithChildren } from "react"

import { ReturnType, useBle } from "../hooks/useBle"

const BLEDevicesContext = createContext<ReturnType>({} as ReturnType)

export const useDeviceActions = () => {
	return useContext(BLEDevicesContext)
}

export const BleEngineProvider = ({ children }: PropsWithChildren<{}>) => {
	const {
		startScan,
		connectDevice,
		disconnectDevice,
		write,
		enginePause,
		enginePaused,
		pingsPause,
		pingsPaused,
	} = useBle()

	return (
		<BLEDevicesContext.Provider
			value={{
				startScan,
				connectDevice,
				disconnectDevice,
				write,
				enginePause,
				enginePaused,
				pingsPause,
				pingsPaused,
			}}
		>
			{children}
		</BLEDevicesContext.Provider>
	)
}
