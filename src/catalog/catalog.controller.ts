import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) { }

  @Get('movies')
  async getMovies() {
    return this.catalogService.findAllMovies();
  }

  @Get('movies/:id/sessions')
  async getSessionsByMovie(@Param('id') movieId: string) {
    return this.catalogService.getSessionsForMovie(movieId);
  }

  @Get('sessions')
  async getAllSessions() {
    return this.catalogService.getAllSessions();
  }

  @Get('sessions/:id')
  async getSessionDetails(@Param('id') sessionId: string) {
    return this.catalogService.getSessionDetails(sessionId);
  }
}