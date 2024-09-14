import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @IsNotEmpty()
  @IsJSON()
  inputData: any;
}
