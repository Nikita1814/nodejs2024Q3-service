import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { CreateAlbumDto, UpdateAlbumDto } from 'src/interfaces/albumDtos';
import { TempDatabaseService } from 'src/services/db.service';

@Controller('album')
export class AlbumController {
constructor(private readonly dbService: TempDatabaseService) {

}

uuidRegex = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)

  @Get()
  findAll(@Res() res: Response) {
    res.status(HttpStatus.OK).json(this.dbService.database.albums);
  }

  @Get(':id')
  findUser(@Res() res: Response, @Param('id') id: string) {
    if (!this.uuidRegex.test(id)){
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'the album id sent is not a valid UUID' });
        return
    }

    const foundAlbum = this.dbService.database.albums.find((album) => album.id === id)

    if (!foundAlbum){
        res.status(HttpStatus.NOT_FOUND).json({ message: 'album not found' });
        return
    } else {
        res.status(HttpStatus.OK).json(foundAlbum);
    }
  }


  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto, @Res() res: Response ) {

    if (!createAlbumDto.name || !createAlbumDto.year) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Please provide all the fields for the album' });
        return
    } else {
    const newAlbum = {
        id: randomUUID(),
        ...createAlbumDto
    }
    this.dbService.database.albums.push(newAlbum);
    res.status(HttpStatus.CREATED).json(newAlbum);
  }
}

  @Put(':id')
  update(@Body() updateAlbumDto: UpdateAlbumDto, @Res() res: Response, @Param('id') id: string ) {

    if (!this.uuidRegex.test(id)){
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'the album id sent is not a valid UUID' });
        return
    } 
    const foundAlbum = this.dbService.database.albums.find((album) => album.id === id);

    if (!foundAlbum){
        res.status(HttpStatus.NOT_FOUND).json({ message: 'album not found' });
        return
    } else {

    const indexOfAlbum = this.dbService.database.albums.findIndex((album) => album.id === id);
    
    this.dbService.database.albums[indexOfAlbum] = {
        ...this.dbService.database.albums[indexOfAlbum],
        ...updateAlbumDto
    }

    res.status(HttpStatus.OK).json( this.dbService.database.tracks[indexOfAlbum]);
    return
    }
  }

  @Delete(':id')
  delete(@Res() res: Response, @Param('id') id: string ) {

    if (!this.uuidRegex.test(id)){
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'The album id sent is not a valid UUID' });
        return
    }

    const foundAlbum = this.dbService.database.albums.find((album) => album.id === id);

    if (!foundAlbum){
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Album not found' });
        return
    }

    const indexOfAlbum = this.dbService.database.albums.findIndex((album) => album.id === id);

    this.dbService.database.tracks = this.dbService.database.tracks.map((track) => {
      if (track.albumId === foundAlbum.id) {
        track.albumId = null
      }
      return track
    })

    const sliced = this.dbService.database.albums.splice(indexOfAlbum,1)

    res.status(HttpStatus.NO_CONTENT).json();
  }

}