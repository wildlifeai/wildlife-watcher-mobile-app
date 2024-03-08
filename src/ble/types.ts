export type ParseCommands = {
	value?: string
	command?: Command | null
	error?: string
}

export enum CommandNames {
	VERSION = "ver",
	BATTERY = "battery",
	ENABLE_LORAWAN = "enable",
	DISABLE_LORAWAN = "disable",
}

// TODO perhaps add regex here
export type Command = {
	name: CommandNames
	command: string
}

export const getCommandByName = (name: CommandNames) => {
	const response = COMMANDS.find((command) => {
		return command.name === name
	})

	if (!response) {
		return null
	}

	return response
}

export const COMMANDS: Command[] = [
	{
		name: CommandNames.VERSION,
		command: "ver",
	},
	{
		name: CommandNames.BATTERY,
		command: "bat",
	},
	{
		name: CommandNames.ENABLE_LORAWAN,
		command: "enable",
	},
	{
		name: CommandNames.DISABLE_LORAWAN,
		command: "disable",
	},
]
