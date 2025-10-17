import { z } from 'zod';

export const CreatePostSchema = z.object({
    title: z.string(),
    content: z.string(),
    authorId: z.uuid(),
}); 

export const UpdatePostSchema = z.object({
    title: z.uuid().optional(),
    content: z.string().optional(),
    authorId: z.uuid().optional(),
}).partial(); 

export const PostResponseSchema = z.object({
        id: z.uuid(),
        title: z.string(),
        content: z.string(),
        authorId: z.uuid(),
 
});

export const DeletePostSchema = z.object({ 
    id: z.uuid()
});

export type CreatePostDTO = z.infer<typeof CreatePostSchema>;
export type UpdatePostDTO = z.infer<typeof UpdatePostSchema>;
export type PostResponseDTO = z.infer<typeof PostResponseSchema>;
export type DeletePostDTO = z.infer<typeof DeletePostSchema>;