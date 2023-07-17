import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    // constructor() {
    //     // super({
    //     //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //     //     ignoreExpiration: false,
    //     //     secretOrKey: process.env.JWT_SECRET,
    //     // }) 
    // }
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '1d' }
        });
    }

    async validate(payload: any) {
        // return payload
        return {
            id: payload.sub,
            mobile: payload.mobile,
        }
    }
}