import { useAppSelector } from "../redux"

type Props = {
	deviceId: string
}

export const useSelectDevice = ({ deviceId }: Props) => {
	const devices = useAppSelector((state) => state.devices)
	const device = devices[deviceId]

	return device
}
