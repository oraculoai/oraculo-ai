import { IsJSON, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'api-key',
    description: 'API key for the user',
  })
  apiKey: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'agent-slug',
    description: 'Slug of the agent',
  })
  agentSlug: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'session-id',
    description: 'Session ID',
  })
  sessionId: string;

  @IsNotEmpty()
  @IsJSON()
  @ApiProperty({
    example: '{ \\"message\\": \\"Hello\\" }',
    description: 'Input data in JSON',
  })
  inputData: any;
}
