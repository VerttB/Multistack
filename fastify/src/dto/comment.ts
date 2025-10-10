export interface CreateCommentDTO {
    content: string;
    postId: string;
    authorId: string;
}
export interface UpdateCommentDTO {
    content?: string;
    postId?: string;
    authorId?: string;
}

export interface CommentResponseDTO {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
}