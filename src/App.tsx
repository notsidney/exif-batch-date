import { useState, useRef, startTransition } from "react";
import { format, setSeconds } from "date-fns";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { reverse } from "lodash-es";

import {
	Container,
	Heading,
	Box,
	Button,
	Flex,
	InputGroup,
	Input,
	InputLeftAddon,
	VStack,
} from "@chakra-ui/react";
import { AttachmentIcon, RepeatIcon, DeleteIcon } from "@chakra-ui/icons";

import Photo from "./Photo";

export default function App() {
	const [photos, setPhotos] = useState<File[]>([]);
	const [baseDate, setBaseDate] = useState<Date | null>(null);
	const [dates, setDates] = useState<Date[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	const setPhotosDates = (baseDate: Date) => {
		if (!baseDate) return null;
		const newDates = [];
		for (let i = 0; i < photos.length; i++) {
			newDates[i] = setSeconds(baseDate, i);
		}
		setDates(newDates);
	};

	return (
		<Container p={6} style={{ fontVariantNumeric: "tabular-nums" }}>
			<VStack spacing={12} alignItems="stretch" height="100%">
				<Box as="header">
					<Heading as="h1" size="lg" mb={4}>
						EXIF Batch Date
					</Heading>

					<Flex gap={2} wrap="wrap" mb={2}>
						<Button
							as="label"
							htmlFor="photos"
							colorScheme={photos.length === 0 ? "blue" : undefined}
							leftIcon={<AttachmentIcon />}
							flexGrow={1}>
							Select photos
						</Button>
						<input
							type="file"
							accept="image/jpeg"
							multiple
							name="photos"
							id="photos"
							ref={inputRef}
							onChange={(e) => {
								if (!e.target.files) return;
								const photos = [];
								for (const file of e.target.files) photos.push(file);
								setPhotos(photos);
								setBaseDate(null);
							}}
							style={{ display: "none" }}
						/>

						<Flex flexGrow={1} gap={2}>
							<Button
								leftIcon={<RepeatIcon />}
								onClick={() => setPhotos((photos) => reverse([...photos]))}
								isDisabled={photos.length < 1}
								flexGrow={1}>
								Reverse
							</Button>

							<Button
								leftIcon={<DeleteIcon />}
								onClick={() => {
									setPhotos([]);
									setBaseDate(null);
								}}
								isDisabled={photos.length < 1}
								flexGrow={1}>
								Reset
							</Button>
						</Flex>
					</Flex>

					<InputGroup as="label">
						<InputLeftAddon>Base date:</InputLeftAddon>
						<Input
							placeholder="Select Date and Time"
							type="datetime-local"
							name="baseDate"
							isDisabled={photos.length === 0}
							value={baseDate ? format(baseDate, "yyyy-MM-dd'T'HH:mm") : ""}
							onChange={(e) => {
								setBaseDate(new Date(e.target.value));
								startTransition(() => {
									setPhotosDates(new Date(e.target.value));
								});
							}}
						/>
					</InputGroup>
				</Box>

				<DragDropContext
					onDragEnd={(result) => {
						if (!result.destination) return;
						const newPhotos = [...photos];
						const moved = newPhotos.splice(result.source.index, 1);
						newPhotos.splice(result.destination.index, 0, moved[0]);
						setPhotos(newPhotos);
					}}>
					<Droppable droppableId="droppable">
						{(provided, snapshot) => (
							<VStack
								spacing={0} // Not supported by rdg
								flexGrow={1}
								{...provided.droppableProps}
								ref={provided.innerRef}>
								{photos.map((file, i) => (
									<Photo
										key={file.name}
										file={file}
										date={dates[i]}
										index={i}
										onDelete={() => {
											const newPhotos = [...photos];
											newPhotos.splice(i, 1);
											setPhotos(newPhotos);
										}}
									/>
								))}

								{provided.placeholder}
							</VStack>
						)}
					</Droppable>
				</DragDropContext>
			</VStack>
		</Container>
	);
}
