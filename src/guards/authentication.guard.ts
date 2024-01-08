import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { IncomingMessage } from 'http'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = this.getRequest<IncomingMessage & { user?: User }>(
        context
      )
      const token = this.getToken(request)
      const { sub } = this.jwtService.verify(token)
      if (!sub) throw new UnauthorizedException('Invalid token')
      const user = await this.usersService.findOne({
        where: {
          id: sub
        },
        relations: ['studentProfile']
      })
      if (!user) throw new UnauthorizedException('Invalid token')
      request.user = user
      return true
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  protected getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest()
  }

  protected getToken(request: {
    headers: Record<string, string | string[]>
  }): string {
    const authorization = request.headers['authorization']
    if (!authorization || Array.isArray(authorization)) {
      throw new UnauthorizedException('Invalid Authorization Header')
    }
    const [_, token] = authorization.split(' ')

    if (!token) throw new UnauthorizedException('Invalid token!')
    return token
  }
}
