import * as React from "react"
import { PropsWithChildren } from "react"
import { useBleListeners } from "../hooks/useBleListeners"

export const ListenToBleEngineProvider = ({
	children,
}: PropsWithChildren<{}>) => {
	useBleListeners()

	return <>{children}</>
}
