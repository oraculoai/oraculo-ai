import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class AddCreditsDto {
  @IsNotEmpty()
  @IsString()
  apiKey: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  credits: number;
}
