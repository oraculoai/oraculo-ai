import { IsString } from 'class-validator';

export class DocumentQaDto {
  @IsString()
  question: string;

  @IsString()
  filePath: string;
}
