import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Get the required roles from the route metadata
        const requiredRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
        if (!requiredRoles) {
            return true; // No roles are required, allow access
        }

        // Get the user from the request
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Check if the user has the required role
        const hasRole = requiredRoles == user.role;
        if (!hasRole) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return true;
    }
}