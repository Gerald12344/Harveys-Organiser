import { FileInput } from '@mantine/core';
import { IconUpload } from '@tabler/icons';

interface Props {
    setImages: (input: string) => void;
    extra: any;
}

export default function ImageUpload({ setImages, extra }: Props) {
    const handleImageUpload = async (files: File[]): Promise<void> => {
        let imagesUrl: string[] = [];
        let fileProm = (id: number) => {
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('image', files[id]);
                let url = '';

                fetch('https://api.imgbb.com/1/upload?key=bcc5a33f3fa5162f81c12dd58ba2e4ff', {
                    method: 'POST',
                    body: formData,
                })
                    .then(async (response) => {
                        if (response.ok) {
                            url = (await (response.json() as any)).data.url;

                            imagesUrl.push(url);
                            resolve('');
                        } else {
                            throw new Error('Upload failed');
                        }
                    })
                    .catch(() => {
                        resolve('');
                        return;
                    });
            });
        };

        await Promise.allSettled(files.map((_, i) => fileProm(i)));
        setImages(imagesUrl[0]);
    };

    return (
        <FileInput
            mt="sm"
            multiple
            label="Attachments"
            accept="image/png,image/jpeg"
            icon={<IconUpload size={14} />}
            placeholder="Attachments"
            {...extra}
            onChange={(files: File[]) => {
                handleImageUpload(files);
            }}
            className="overflow-hidden"
        />
    );
}
