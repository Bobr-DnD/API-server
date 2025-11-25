// utils/uploadFile.js
import { bucket } from "../plugins/firebase.js";
import path from "path";

export async function uploadFile(file, folder = "images") {
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

    return { url: publicUrl, path: fileName };
}


export async function parseCharacterRequest(req) {
    const file = await req.file().catch(() => null);

    const fields = file ? JSON.parse(file.fields.character.value) : req.body;

    let imageUrl = null;

    // Upload file only if present
    if (file) {
        const saved = await uploadFile(file, "images");
        imageUrl = saved.url;
    }

    return {
        character_data: fields,
        image: imageUrl
    }
}

export async function parseSessionRequest(req) {
    const file = await req.file().catch(() => null);

    const fields = file ? JSON.parse(file.fields.session.value) : req.body;

    let imageUrl = null;

    // Upload file only if present
    if (file) {
        const saved = await uploadFile(file, "images");
        imageUrl = saved.url;
    }

    return {
        session_data: fields,
        image: imageUrl
    }
}