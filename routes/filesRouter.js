import { uploadFile, deleteFile } from "../controllers/filesController.js";

export default async function filesRouter(fastify) {
    fastify.post('/', uploadFile);
    fastify.delete('/', deleteFile);
}
