import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('App')
  @ApiOperation({
    summary: 'Check API Health',
    description: 'Performs a health check and returns API status.',
  })
  @ApiResponse({ status: 200, description: 'Server is running' })
  @Get('healthcheck')
  getHello(): string {
    return this.appService.healthcheck();
  }
}
