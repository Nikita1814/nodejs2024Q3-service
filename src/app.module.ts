import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TempDatabaseService } from './services/db.service';
import { UserController } from './controllers/usersController';
import { TrackController } from './controllers/tracksController';
import { AlbumController } from './controllers/albumsController';
import { ArtistsController } from './controllers/artistsController';

@Module({
  imports: [],
  controllers: [AppController, UserController, TrackController, AlbumController, ArtistsController],
  providers: [AppService, TempDatabaseService],
})
export class AppModule {}
