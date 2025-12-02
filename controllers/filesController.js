import { bucket } from "../plugins/firebase.js";
import path from "path";

const folder = 'images'

export const uploadFile = async (request, response) => {

    const file = await request.file().catch(() => null);
    const buffer = await file.toBuffer();

    const ext = path.extname(file.filename);
    const fileName = `${folder}/${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
    const storageFile = bucket.file(fileName);


    await storageFile.save(buffer, {
        metadata: {
            contentType: file.mimetype,
        },
        public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return response.code(200).send(publicUrl)
}

export const deleteFile = async (request, response) => { 
    await bucket.file(`images/${request.params.fileName}`).delete();
    return response.code(200).send({ message: 'Success' })
}