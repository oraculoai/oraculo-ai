import { ApiProperty } from '@nestjs/swagger';

export class ArtifactDomain {
  @ApiProperty({
    example: '670086e6d2ef80bd46b2efe3',
    description: 'Artifact ID',
  })
  id: string;

  @ApiProperty({
    example: '6712a83b10f8cd71f72e4e7f',
    description: 'Request ID',
  })
  requestId: string;

  @ApiProperty({
    example: 'agent-slug',
    description: 'Agent slug that generated the artifact',
  })
  generatedBy: string;

  @ApiProperty({
    example: '{ "message": "Hello" }',
    description: 'Content of the artifact',
  })
  content: any;
}
