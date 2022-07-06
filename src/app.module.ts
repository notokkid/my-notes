import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './auth/user.service';
import { UserModule } from './auth/user.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [UserModule, NotesModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
