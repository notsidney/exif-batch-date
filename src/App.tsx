import { useState, useRef, startTransition } from "react";
import { setSeconds } from "date-fns";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

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
import { AttachmentIcon, DeleteIcon } from "@chakra-ui/icons";

import Photo from "./Photo";

export default function App() {
	const [photos, setPhotos] = useState<File[]>([]);
	const [baseDate, setBaseDate] = useState<Date>(new Date());
	const [dates, setDates] = useState<Date[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	const setPhotosDates = (baseDate: Date) => {
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

					<Flex gap={2}>
						<Button
							colorScheme={photos.length === 0 ? "blue" : undefined}
							mb="5"
							leftIcon={<AttachmentIcon />}
							onClick={() => inputRef.current!.click()}
							flexGrow={1}>
							Select photos
						</Button>
						<input
							type="file"
							accept="image/jpeg"
							multiple
							aria-label="Photos"
							name="photos"
							id="photos"
							ref={inputRef}
							onChange={(e) => {
								if (!e.target.files) return;
								const photos = [];
								for (const file of e.target.files) photos.push(file);
								setPhotos(photos);
								setPhotosDates(baseDate);
							}}
							style={{ display: "none" }}
						/>

						<Button
							leftIcon={<DeleteIcon />}
							onClick={() => setPhotos([])}
							isDisabled={photos.length < 1}>
							Reset
						</Button>
					</Flex>

					<InputGroup as="label">
						<InputLeftAddon>Base date:</InputLeftAddon>
						<Input
							placeholder="Select Date and Time"
							type="datetime-local"
							name="baseDate"
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
