import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { User } from 'src/interfaces/dbInterfaces';
import { CreateUserDto, UpdateUserDto } from 'src/interfaces/userDtos';
import { TempDatabaseService } from 'src/services/db.service';

@Controller('user')
export class UserController {
constructor(private readonly dbService: TempDatabaseService) {

}

uuidRegex = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)

  @Get()
  findAll(@Res() res: Response) {
    res.status(HttpStatus.OK).json(this.dbService.database.users);
  }

  @Get(':id')
  findUser(@Res() res: Response, @Param('id') id: string) {
    if (!this.uuidRegex.test(id)){
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'the user id sent is not a valid UUID' });
        return
    }

    const foundUser = this.dbService.database.users.find((user) => user.id === id)

    if (!foundUser){
        res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
        return
    } else {
        const {password, ...rest} = foundUser
        res.status(HttpStatus.OK).json({...rest});
    }
  }


  @Post()
  create(@Body() createUserDto: CreateUserDto, @Res() res: Response ) {

    if (!createUserDto.login || !createUserDto.password) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Please provide a login and password for the user' });
        return
    } else {
    const newUser = {
        id: randomUUID(),
        login: createUserDto.login,
        password: createUserDto.password,
        version: 0,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
    }
    this.dbService.database.users.push(newUser);
    const {password, ...rest} = newUser
    res.status(HttpStatus.CREATED).json({...rest});
  }
}

  @Put(':id')
  update(@Body() updateUserDto: UpdateUserDto, @Res() res: Response, @Param('id') id: string ) {

    if (!this.uuidRegex.test(id)){
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'the user id sent is not a valid UUID' });
        return
    } else  if (!updateUserDto.oldPassword || !updateUserDto.newPassword){
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Please provide the old and new password for the user' });
        return
    } 
    const foundUser = this.dbService.database.users.find((user) => user.id === id);

    if (!foundUser){
        res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
        return
    }

    const indexOfUser = this.dbService.database.users.findIndex((user) => user.id === id);

    if (!(this.dbService.database.users[indexOfUser].password === updateUserDto.oldPassword) ){
        res.status(HttpStatus.FORBIDDEN).json({ message: 'The old password does not match' });
        return
    } else {



    this.dbService.database.users[indexOfUser].password = updateUserDto.newPassword
    const {password, ...rest} = this.dbService.database.users[indexOfUser]
    res.status(HttpStatus.OK).json({...rest});
    return
    }
  }

  @Delete(':id')
  delete(@Body() updateUserDto: UpdateUserDto, @Res() res: Response, @Param('id') id: string ) {

    if (!this.uuidRegex.test(id)){
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'the user id sent is not a valid UUID' });
        return
    }

    const foundUser = this.dbService.database.users.find((user) => user.id === id);

    if (!foundUser){
        res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
        return
    }

    const indexOfUser = this.dbService.database.users.findIndex((user) => user.id === id);

    const sliced = this.dbService.database.users.splice(indexOfUser,1)

    res.status(HttpStatus.NO_CONTENT).json();
  }

}