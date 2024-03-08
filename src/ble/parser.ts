import { CommandNames, ParseCommands, getCommandByName } from "./types"

export const parseLogs = (finishedLog: string, lastLog: string) => {
	if (lastLog.trim().length === 0) return []
	if (!lastLog.match(/\n/)) return []

	const results: ParseCommands[] = []

	const lines = finishedLog.split(/\r?\n/)

	if (!lines[0]) return []

	if (lines.find((tclv) => tclv.includes("Battery"))) {
		const command = getCommandByName(CommandNames.VERSION)

		return {
			response: {
				value: "Parsed from CLI",
				id: tclv.id,
				control: TCLVControlTypes.READ,
				length: 0,
			},
			tclv,
		}
	}

	return []
}
