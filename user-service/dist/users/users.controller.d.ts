import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(userId: string): Promise<import("./entities/user.entity").UserEntity>;
    findAll(): Promise<import("./entities/user.entity").UserEntity[]>;
}
