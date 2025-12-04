import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: import("../users/entities/user.entity").UserEntity;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: import("../users/entities/user.entity").UserEntity;
    }>;
}
