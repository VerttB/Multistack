import { AppError } from "../errors/AppError";

enum Role {
    Admin = 'admin',
    User = 'user'
}
type Action = 'create' | 'read' | 'update' | 'delete' | 'all'
type Resource = 'user' | 'post' | 'comment'


interface Permission {
    action: Action;
    resource: Resource;
    restriction?: (userId: string, resourceOwnerId: string) => boolean;
}


const roles: Record<Role, Permission[]> = {
    [Role.Admin]: [
        {  action: 'all', resource: 'user' },
        {  action: 'all', resource: 'post' },
        {  action: 'all', resource: 'comment' },
    ],
    [Role.User]: [
        { action: 'read', resource: 'user' },
        { action: 'create', resource: 'post' },
        { action: 'read', resource: 'post' },
        { action: 'update', resource: 'post', restriction: (userId, resourceOwnerId) => userId === resourceOwnerId },
        { action: 'delete', resource: 'post' },
        { action: 'create', resource: 'comment' },
        { action: 'read', resource: 'comment' },
        { action: 'update', resource: 'comment', restriction: (userId, resourceOwnerId) => userId === resourceOwnerId },
        { action: 'delete', resource: 'comment', restriction: (userId, resourceOwnerId) => userId === resourceOwnerId },
    ],
};

 
export const checkPermission = (role: string, action: Action, resource: Resource, userId?: string, resourceOwnerId?: string): boolean => {
    const permissions = roles[role as keyof typeof roles];
    if (!permissions) return false
    for (const permission of permissions) {
        const actionPermission = permission.action === 'all' || permission.action === action;
        if (actionPermission && permission.resource === resource) {
            if (permission.restriction) {
                if (!userId || !resourceOwnerId) {
                    throw new AppError('User ID and Resource Owner ID are required for this action', 400);
                }
                return permission.restriction(userId, resourceOwnerId);
            }
            return true;
        }
    }
    throw new AppError('Permission denied', 403);
};