import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';

@Controller('file')
export class fileController {
  //to get the profile pic
  @Get('/:filename')
  async getFile(@Param('filename') filename): Promise<StreamableFile> {
    const file = createReadStream(`./files/${filename}`);
    return new StreamableFile(file);
  }
}
