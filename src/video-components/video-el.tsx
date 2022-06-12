import { ArrowRightIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
	Button,
	Center,
	Code,
	FormControl,
	FormHelperText,
	Grid,
	GridItem,
	Heading,
	Stack,
} from '@chakra-ui/react';
import {
	AutoComplete,
	AutoCompleteInput,
	AutoCompleteItem,
	AutoCompleteList,
} from '@choc-ui/chakra-autocomplete';
import { zip } from 'lodash';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { createRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';

interface Props {}

interface FilesResponse {
	files: string[];
	filePaths: string[];
}

const fetchSearch = async (search: string) => {
	try {
		let result = await axios.post<FilesResponse>('/search', {
			query: search,
		});
		if (result.status === 200) {
			const { files, filePaths } = result.data;
			return zip(files, filePaths)
				.map(([file, path]) => {
					return {
						label: file,
						value: path?.replaceAll('//', '/'),
					};
				})
				.filter((e) => e) as { label: string; value: string }[];
		} else {
			return [];
		}
	} catch (err) {
		console.log(err);
		return [];
	}
};
const startId = nanoid();
export const VideoJS = (props: Props) => {
	const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
	const searchRef = createRef<HTMLInputElement>();
	const videoRef = createRef<ReactPlayer>();
	const [randomId, setRandomId] = useState(startId);
	const resetId = () => {
		const id = nanoid();
		setRandomId(id);
	};
	return (
		<Grid
			templateAreas={`"header"
                  "main"
                  "footer"`}
			gridTemplateRows={'80px 1fr 60px'}
			gridTemplateColumns={'1fr'}
			w="100vw"
			h="100vh"
			gap="0"
			fontWeight="bold">
			<GridItem p="2" area={'header'}>
				<Grid gridTemplateRows={'1fr'} gridTemplateColumns={'1fr 1fr'} templateAreas={'left right'}>
					<GridItem colSpan={1} area={'left'}>
						<Heading mt="0" ml={'2'} as="h3">
							<Code pr={'8'} fontSize={20}>
								<ChevronRightIcon scale={2} lineHeight={2} mb={2} fontSize={50} />
								Zippy Player
							</Code>
						</Heading>
					</GridItem>
					<GridItem colSpan={1} area={'right'} display="flex" justifyContent={'center'}>
						<FormControl w="800px">
							<Stack direction="row" marginTop="15px">
								<AutoComplete openOnFocus>
									<AutoCompleteInput
										maxWidth={'800px'}
										variant="filled"
										placeholder="Search"
										border={'2px solid silver'}
										ref={searchRef}
										onInput={(evt) => {
											fetchSearch(evt.currentTarget.value).then((result) => {
												setOptions(result);
											});
										}}
									/>
									<AutoCompleteList
										maxWidth={'800px'}
										onSelect={(evt) => {
											if (searchRef.current && evt.currentTarget.nodeValue) {
												searchRef.current.value = evt.currentTarget.nodeValue;
												searchRef.current.focus();
											}
										}}>
										{options.map((name) => (
											<AutoCompleteItem
												key={`option-${name.label}`}
												value={name.value}
												textTransform="capitalize">
												{name.label}
											</AutoCompleteItem>
										))}
									</AutoCompleteList>
								</AutoComplete>
								<FormHelperText>Select Video Path.</FormHelperText>
								<Button
									onClick={async () => {
										if (searchRef.current?.value) {
											const result = await axios.post('/select', {
												fileName: searchRef.current?.value,
											});
											console.log(result);
											if (result.status === 200) {
												resetId();
											}
										}
									}}>
									<ArrowRightIcon />
									Select
								</Button>
							</Stack>
						</FormControl>
					</GridItem>
				</Grid>
			</GridItem>

			<GridItem p="2" bg="rgb(36, 41, 54)" area={'main'}>
				<Center h="auto" bg="inherit">
					<ReactPlayer
						ref={videoRef}
						url={'/video?' + (randomId || '1234')}
						controls
						height="auto"
						width={'98%'}
					/>
				</Center>
			</GridItem>
			<GridItem pl="2" area={'footer'}></GridItem>
		</Grid>
	);
};

export default VideoJS;
