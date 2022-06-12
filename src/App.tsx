import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import VideoJS from './video-components/video-el';
function App() {
	return (
		<ChakraProvider theme={theme}>
			<VideoJS />
		</ChakraProvider>
	);
}

export default App;
