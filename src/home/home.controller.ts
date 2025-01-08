import { Controller, Get, HttpStatus } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('/')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getRoot() {
    const data = this.homeService.getWelcomeMessage();
    return {
      status: HttpStatus.OK,
      message: data,
    };
  }
}
