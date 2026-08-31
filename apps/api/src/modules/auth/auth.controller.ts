import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import type { AutenticacionResponse } from "@gimnasio/shared";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<AutenticacionResponse> {
    return this.authService.login(dto);
  }
}