import { useCallback, useState } from "react"
import { useEffect, useRef } from "react"
import {
	Command,
	CommandConstructOptions,
	CommandControlTypes,
	CommandNames,
} from "../ble/types"
import { useAppSelector } from "../redux"
import { ExtendedPeripheral } from "../redux/slices/devicesSlice"
import { logError, log } from "../utils/logger"
import { useBleActions } from "../providers/BleEngineProvider"
import { ConfigKey } from "../redux/slices/configurationSlice"

type Props = {
	deviceId: string
	command: Command
}

const INTERVAL = 1000 * 8
const TIMEOUT = 1000 * 45

export const useCommand = ({ deviceId, command }: Props) => {
	const requestRef = useRef<NodeJS.Timeout>()
	const timeoutRef = useRef<NodeJS.Timeout>()
	const [goal, setGoal] = useState<number | string>()

	const { write } = useBleActions()
	const devices = useAppSelector((state) => state.devices)
	const configuration = useAppSelector((state) => state.configuration)

	const [error, setError] = useState<Error | undefined>()
	const [initialHookLoad, setInitialHookLoad] = useState(false)

	const device = devices[deviceId] as ExtendedPeripheral

	const clearTimers = () => {
		requestRef.current && clearInterval(requestRef.current)
		timeoutRef.current && clearTimeout(timeoutRef.current)
	}

	const sendCommand = useCallback(
		(rw: CommandControlTypes, value?: string) => {
			const payload: [CommandNames, CommandConstructOptions][] = [
				[
					command.name,
					{
						control: CommandControlTypes.READ,
					},
				],
			]

			if (rw === CommandControlTypes.WRITE) {
				payload.unshift([
					command.name,
					{
						control: CommandControlTypes.WRITE,
						value,
					},
				])
			}
			write(device, payload)
		},
		[device, command.name, write],
	)

	const set = useCallback(
		(data: string) => {
			clearTimers()

			sendCommand(CommandControlTypes.WRITE, data)

			requestRef.current = setInterval(
				() => sendCommand(CommandControlTypes.WRITE, data),
				INTERVAL,
			)
			timeoutRef.current = setTimeout(() => {
				if (requestRef.current) {
					clearInterval(requestRef.current)
				}
				setError(Error(`Trying to set ${command.name} timed out.`))
				logError(`Trying to set ${command.name} timed out.`)
			}, TIMEOUT)

			setGoal(data)
		},
		[sendCommand, command.name],
	)

	const get = useCallback(() => {
		clearTimers()

		sendCommand(CommandControlTypes.READ)

		requestRef.current = setInterval(
			() => sendCommand(CommandControlTypes.READ),
			INTERVAL,
		)
		timeoutRef.current = setTimeout(() => {
			if (requestRef.current) {
				clearInterval(requestRef.current)
			}
			setError(Error(`Trying to get ${command.name} timed out.`))
			logError(`Trying to get ${command.name} timed out.`)
		}, TIMEOUT)

		setGoal(undefined)
	}, [sendCommand, command.name])

	useEffect(() => {
		const config = configuration[device.id]

		if (isCommandCompleted({ goal, config: config[command.name] })) {
			clearTimers()

			/**
			 * If the hook already detects the correct configuration
			 * when it first renders, the get() method isn't even
			 * fired, so we simply make sure to avoid running the
			 * get() below.
			 */
			setInitialHookLoad(true)
			setGoal(undefined)

			return
		}

		if (requestRef.current || initialHookLoad) return

		get()
	}, [
		write,
		command.name,
		sendCommand,
		goal,
		get,
		configuration,
		initialHookLoad,
		device,
		deviceId,
		command,
	])

	useEffect(() => {
		return () => {
			log(`Cancelling timers for ${command.name} hook.`)
			clearTimers()
		}
	}, [command.name])

	return {
		set,
		get,
		error,
	}
}

const isCommandCompleted = ({
	config,
	goal,
}: {
	config?: ConfigKey
	goal?: number | string
}) => {
	if (!config) return false

	if (goal) {
		return config.value === goal
	}

	if (!config.value && config.value !== "") {
		return false
	}
	return true
}
