import { useRouter } from '@adonisjs/inertia/react';
import { CloudUploadIcon, ImageIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';

import type { Data } from '#generated/data';

import { Button } from '~/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog';
import { FieldError } from '~/components/ui/field';
import { cn } from '~/lib/utils';

async function loadImage(src: string) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image();
		image.addEventListener('load', () => resolve(image));
		image.addEventListener('error', () => reject(new Error('Failed to load image')));
		image.src = src;
	});
}

async function cropImageToBlob(src: string, area: Area) {
	const image = await loadImage(src);
	const canvas = document.createElement('canvas');
	canvas.width = area.width;
	canvas.height = area.height;

	const context = canvas.getContext('2d');

	if (!context) {
		throw new Error('Canvas is not supported');
	}

	context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);

	return new Promise<Blob>((resolve, reject) => {
		canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Failed to crop image'))), 'image/png');
	});
}

export function ProjectPictureDialog({ project }: { project: Data.Projects.Project }) {
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedArea, setCroppedArea] = useState<Area | null>(null);
	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const reset = () => {
		setImageSrc(null);
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setCroppedArea(null);
		setError(null);
		setDragging(false);
	};

	const handleOpenChange = (next: boolean) => {
		setOpen(next);

		if (!next) {
			reset();
		}
	};

	const loadFile = (file: File) => {
		if (!file.type.startsWith('image/')) {
			setError('Please select an image file.');

			return;
		}

		setError(null);

		const reader = new FileReader();

		reader.addEventListener('load', () => setImageSrc(reader.result as string));
		reader.readAsDataURL(file);
	};

	const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			loadFile(file);
		}

		event.target.value = '';
	};

	function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
		event.preventDefault();

		setDragging(false);

		const file = event.dataTransfer.files.item(0);

		if (file) {
			loadFile(file);
		}
	}

	async function handleUpload() {
		if (!imageSrc || !croppedArea) {
			return;
		}

		setProcessing(true);
		setError(null);

		try {
			const blob = await cropImageToBlob(imageSrc, croppedArea);
			const formData = new FormData();

			formData.append('picture', blob, 'picture.png');

			router.visit(
				{ route: 'projects.picture.store', routeParams: { slug: project.slug } },
				{
					data: formData,
					forceFormData: true,
					preserveScroll: true,
					onSuccess: () => handleOpenChange(false),
					onError: () => {
						setError('Could not upload the picture. Please try a different image.');
						setProcessing(false);
					},
					onFinish: () => setProcessing(false),
				},
			);
		} catch {
			setError('Could not process the image. Please try a different one.');
			setProcessing(false);
		}
	}

	const handleDelete = () => {
		setProcessing(true);

		router.visit(
			{ route: 'projects.picture.destroy', routeParams: { slug: project.slug } },
			{
				preserveScroll: true,
				onSuccess: () => handleOpenChange(false),
				onFinish: () => setProcessing(false),
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label="Change project picture"
				className="group relative size-20 shrink-0 overflow-hidden rounded-lg"
			>
				{project.pictureUrl ? (
					<img src={project.pictureUrl} alt="" data-slot="project-picture" className="size-full object-cover" />
				) : (
					<div className="bg-muted text-muted-foreground flex size-full items-center justify-center">
						<ImageIcon className="size-8" />
					</div>
				)}

				<div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
					<span className="text-xs font-medium text-white">Edit</span>
				</div>
			</button>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Project picture</DialogTitle>
					<DialogDescription>Upload a square image. You can crop and zoom before saving.</DialogDescription>
				</DialogHeader>

				{imageSrc ? (
					<div className="flex flex-col gap-4">
						<div className="bg-muted relative h-64 w-full overflow-hidden rounded-md">
							<Cropper
								image={imageSrc}
								crop={crop}
								zoom={zoom}
								aspect={1}
								cropShape="rect"
								showGrid={false}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={(_area, areaPixels) => setCroppedArea(areaPixels)}
							/>
						</div>

						<div className="flex items-center gap-3">
							<label htmlFor="zoom" className="text-muted-foreground shrink-0 text-sm">
								Zoom
							</label>
							<input
								id="zoom"
								type="range"
								min={1}
								max={3}
								step={0.1}
								value={zoom}
								onChange={(event) => setZoom(Number(event.target.value))}
								className="w-full"
							/>
						</div>
					</div>
				) : (
					// oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
					<label
						onDragOver={(event) => {
							event.preventDefault();
							setDragging(true);
						}}
						onDragLeave={() => setDragging(false)}
						onDrop={handleDrop}
						className={cn(
							'border-input flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-center',
							dragging && 'bg-muted border-ring',
						)}
					>
						<CloudUploadIcon className="text-muted-foreground size-6" />

						<p className="text-sm">
							<span className="font-medium">Click to upload</span> or drag and drop
						</p>
						<p className="text-muted-foreground text-xs">PNG, JPG or WEBP, up to 2MB</p>

						<input
							type="file"
							aria-label="Picture"
							accept="image/png,image/jpeg,image/webp"
							className="hidden"
							onChange={handleFileInputChange}
						/>
					</label>
				)}

				{error && <FieldError>{error}</FieldError>}

				<DialogFooter className="sm:justify-between">
					<div>
						{project.pictureUrl && !imageSrc && (
							<Button type="button" variant="destructive" onClick={handleDelete} disabled={processing}>
								<Trash2Icon data-icon="inline-start" />
								Delete picture
							</Button>
						)}
					</div>

					{imageSrc && (
						<div className="flex gap-2">
							<Button type="button" variant="outline" onClick={() => setImageSrc(null)} disabled={processing}>
								Choose another
							</Button>

							<Button type="button" onClick={handleUpload} disabled={processing || !croppedArea}>
								Save
							</Button>
						</div>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
