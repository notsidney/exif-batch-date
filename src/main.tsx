import ReactDOM from "react-dom/client";
import App from "./App";

import {
	ChakraBaseProvider,
	extendBaseTheme,
	ColorModeScript,
} from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";
const {
	Container,
	Heading,
	Box,
	Button,
	Flex,
	InputGroup,
	Input,
	InputLeftAddon,
	VStack,
	Image,
	Text,
	IconButton,
} = chakraTheme.components as any;

const theme = extendBaseTheme({
	components: {
		Container,
		Heading,
		Box,
		Button,
		Flex,
		InputGroup,
		Input,
		InputLeftAddon,
		VStack,
		Image,
		Text,
		IconButton,
	},
	config: {
		initialColorMode: "system",
		useSystemColorMode: true,
	},
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	// <React.StrictMode>
	<ChakraBaseProvider theme={theme}>
		<ColorModeScript initialColorMode={theme.config.initialColorMode} />
		<App />
	</ChakraBaseProvider>
	// </React.StrictMode>
);
