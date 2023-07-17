import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { Reflector } from '@nestjs/core';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

// @Injectable()
// export class ApiAuthGuard implements CanActivate {
//     constructor(
//         private service: UserService,
//         private reflector: Reflector) { }
//     canActivate(
//         context: ExecutionContext,
//     ): boolean | Promise<boolean> | Observable<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const roles = this.reflector.get<string>('api-key', context.getHandler());
//         // return  validateRequest(request);
//         return true

//     }
// }

@Injectable()
export class ApiAuthGuard extends AuthGuard('api-key') {
}

