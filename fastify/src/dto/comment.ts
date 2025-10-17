import { z } from 'zod';

export const CreateCommentSchema = z.object({
    content: z.string(),
    postId: z.string(),
    authorId: z.string(),
});

export const UpdateCommentSchema = z.object({
    content: z.uuid().optional(),
    postId: z.string().optional(),
    authorId: z.string().optional(),
}).partial();

export const CommentResponseSchema = z.object({
    id: z.uuid(),
    content: z.string(),
    postId: z.string(),
    authorId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const DeleteCommentSchema = z.object({ 
    id: z.string()
});     

export type CreateCommentDTO = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentDTO = z.infer<typeof UpdateCommentSchema>; 
export type CommentResponseDTO = z.infer<typeof CommentResponseSchema>;
export type DeleteCommentDTO = z.infer<typeof DeleteCommentSchema>;
