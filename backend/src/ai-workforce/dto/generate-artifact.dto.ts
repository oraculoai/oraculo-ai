import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class GenerateArtifactDto {
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @IsNotEmpty()
  @IsJSON()
  inputData: any;
}
