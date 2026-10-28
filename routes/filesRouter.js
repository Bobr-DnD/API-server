import { uploadFile, deleteFile } from "../controllers/filesController.js";

export default async function filesRouter(fastify) {
    fastify.post('/', { preHandler: fastify.requireAdmin }, uploadFile);
    fastify.delete('/:fileName', { preHandler: fastify.requireAdmin }, deleteFile);
}
