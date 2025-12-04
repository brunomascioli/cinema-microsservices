import { ConfigService } from '@nestjs/config';
import { ActiveUserData } from '../types/active-user-data.interface';
import { JwtPayload } from '../types/jwt-payload.interface';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): ActiveUserData;
}
export {};
