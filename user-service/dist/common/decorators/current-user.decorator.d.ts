import { ActiveUserData } from '../../auth/types/active-user-data.interface';
export declare const CurrentUser: (...dataOrPipes: (keyof ActiveUserData | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
