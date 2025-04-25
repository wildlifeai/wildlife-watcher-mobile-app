declare module "react-native-config" {
	export interface NativeConfig {
		API_BASE?: string
		GOOGLE_MAPS_API_KEY_ANDROID?: string
		GOOGLE_MAPS_API_KEY_IOS?: string
	}

	export const Config: NativeConfig
	export default Config
}
