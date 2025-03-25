import { useForm } from "react-hook-form"
import { StyleSheet, View, Image } from "react-native"
import { Button } from "react-native-paper"
import { CustomKeyboardAvoidingView } from "../../components/CustomKeyboardAvoidingView"
import { WWScreenView } from "../../components/ui/WWScreenView"
import { WWTextInput } from "../../components/ui/WWTextInput"
import { Field } from "../../components/form/Field"
import { useRegisterMutation } from "../../redux/api/auth"
import { useAppDispatch } from "../../redux"
import { setCredentials } from "../../redux/slices/authSlice"
import { useAppNavigation } from "../../hooks/useAppNavigation"
import { WWText } from "../../components/ui/WWText"

type FormData = {
	username: string
	email: string
	password: string
	confirmPassword: string
}

export const Register = () => {
	const dispatch = useAppDispatch()
	const navigation = useAppNavigation()
	const [register, { isLoading, error: apiError }] = useRegisterMutation()

	const { control, handleSubmit, setError } = useForm<FormData>({
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	})

	const onSubmit = async (data: FormData) => {
		if (data.password !== data.confirmPassword) {
			setError("confirmPassword", {
				type: "manual",
				message: "Passwords do not match",
			})
			return
		}

		try {
			console.log({
				username: data.username,
				email: data.email,
				password: data.password,
			})
			const response = await register({
				username: data.username,
				email: data.email,
				password: data.password,
			}).unwrap()

			dispatch(setCredentials(response))
		} catch (err) {
			console.error("Registration failed:", JSON.stringify(err))
		}
	}

	return (
		<CustomKeyboardAvoidingView>
			<WWScreenView style={styles.view}>
				<View style={styles.container}>
					<View style={styles.logoContainer}>
						<Image
							source={require("../../assets/ww-logo-1.png")}
							style={styles.logo}
							resizeMode="contain"
						/>
					</View>
					<View style={styles.form}>
						<Field
							control={control}
							name="username"
							label="Username"
							required
							rules={{
								required: "Username is required",
								minLength: {
									value: 3,
									message: "Username must be at least 3 characters",
								},
							}}
						>
							{(field) => <WWTextInput {...field} mode="outlined" />}
						</Field>

						<Field
							control={control}
							name="email"
							label="Email"
							required
							rules={{
								required: "Email is required",
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: "Invalid email address",
								},
							}}
						>
							{(field) => (
								<WWTextInput
									{...field}
									mode="outlined"
									textContentType="emailAddress"
									keyboardType="email-address"
								/>
							)}
						</Field>

						<Field
							control={control}
							name="password"
							label="Password"
							required
							rules={{
								required: "Password is required",
								minLength: {
									value: 6,
									message: "Password must be at least 6 characters",
								},
							}}
						>
							{(field) => (
								<WWTextInput {...field} mode="outlined" secureTextEntry />
							)}
						</Field>

						<Field
							control={control}
							name="confirmPassword"
							label="Confirm Password"
							required
							rules={{
								required: "Please confirm your password",
							}}
						>
							{(field) => (
								<WWTextInput {...field} mode="outlined" secureTextEntry />
							)}
						</Field>

						{apiError && (
							<WWText style={styles.error}>
								{(apiError as any)?.data?.error?.message ||
									JSON.stringify(apiError)}
							</WWText>
						)}

						<Button
							mode="contained"
							onPress={handleSubmit(onSubmit)}
							loading={isLoading}
							style={styles.button}
						>
							Register
						</Button>

						<Button
							mode="text"
							onPress={() => navigation.navigate("Login")}
							style={styles.button}
						>
							Already have an account? Login
						</Button>
					</View>
				</View>
			</WWScreenView>
		</CustomKeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	view: {
		flex: 1,
	},
	container: {
		flex: 1,
		justifyContent: "center",
	},
	logoContainer: {
		alignItems: "center",
	},
	logo: {
		width: 150,
		height: 150,
	},
	form: {
		padding: 20,
		gap: 10,
	},
	button: {
		marginTop: 10,
	},
	error: {
		color: "red",
		textAlign: "center",
	},
})
