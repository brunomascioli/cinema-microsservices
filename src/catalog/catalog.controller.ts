import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) { }

  @Get('movies')
  async getMovies() {
    return this.catalogService.findAllMovies();
  }

  @Post('sessions')
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    return this.catalogService.createSession(createSessionDto);
  }

  @Get('movies/:id/sessions')
  async getSessionsByMovie(@Param('id') movieId: string) {
    return this.catalogService.getSessionsForMovie(movieId);
  }
}