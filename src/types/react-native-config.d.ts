declare module "react-native-config" {
	export interface NativeConfig {
		API_BASE?: string
	}

	export const Config: NativeConfig
	export default Config
}
