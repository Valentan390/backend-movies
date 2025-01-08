import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { isValidObjectId } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export class GetIdDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    if (!isValidObjectId(value)) {
      throw new HttpException(`${value} not valid id`, HttpStatus.NOT_FOUND);
    }
    return value;
  })
  id: string;
}
