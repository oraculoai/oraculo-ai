import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AddCreditsDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  credits: number;
}
