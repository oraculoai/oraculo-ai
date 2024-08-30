import { IsString } from 'class-validator';

export class TaskDto {
  @IsString()
  description: string;
}
