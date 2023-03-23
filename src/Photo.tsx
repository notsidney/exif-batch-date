import { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { format } from "date-fns";
import { merge } from "lodash-es";
import piexif from "piexifjs";

import { Flex, Image, Text, IconButton } from "@chakra-ui/react";
import { DragHandleIcon, DownloadIcon, DeleteIcon } from "@chakra-ui/icons";

export interface IPhotoProps {
	file: File;
	date: Date;
	index: number;
	onDelete: () => void;
}

export default function Photo({ file, date, index, onDelete }: IPhotoProps) {
	const [fileDataURL, setFileDataURL] = useState("");

	useEffect(() => {
		if (!file) return;

		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			const { result } = e.target as any;
			if (result) setFileDataURL(result);
		};
		fileReader.readAsDataURL(file);
	}, [file]);

	let downloadURL = "";
	if (date && fileDataURL) {
		const exifDate = format(date, "yyyy:MM:dd HH:mm:ss");

		const exifObj = merge(piexif.load(fileDataURL), {
			// https://github.com/hMatoba/piexifjs/blob/2180d60b8cdf638e236e0a6703b7c378bb4f5785/piexif.js#L2147
			"0th": { [piexif.ImageIFD.DateTime]: exifDate },
			Exif: {
				[piexif.ExifIFD.DateTimeOriginal]: exifDate,
				[piexif.ExifIFD.DateTimeDigitized]: exifDate,
			},
		});

		downloadURL = piexif.insert(piexif.dump(exifObj), fileDataURL);
	}

	return (
		<Draggable key={file.name} draggableId={file.name} index={index}>
			{(provided, snapshot) => (
				<Flex
					gap={4}
					pb={5}
					width="100%"
					justifyContent="flex-start"
					alignItems="center"
					ref={provided.innerRef}
					{...provided.draggableProps}>
					<div style={{ cursor: "grab" }} {...provided.dragHandleProps}>
						<DragHandleIcon />
					</div>

					<Image
						src={fileDataURL}
						alt="preview"
						borderRadius={4}
						width={100}
						height={67}
					/>

					<Text fontSize="sm" flexShrink={0}>
						{file.name}
					</Text>
					<Text fontSize="sm" fontWeight="bold" flexGrow={1}>
						{date ? date.toLocaleTimeString() : "‒"}
					</Text>

					<IconButton
						aria-label="Delete"
						icon={<DeleteIcon />}
						onClick={onDelete}
					/>

					<IconButton
						aria-label="Save"
						icon={<DownloadIcon />}
						colorScheme={downloadURL ? "blue" : undefined}
						isDisabled={!downloadURL}
						as="a"
						download={file.name}
						href={downloadURL}
					/>
				</Flex>
			)}
		</Draggable>
	);
}
