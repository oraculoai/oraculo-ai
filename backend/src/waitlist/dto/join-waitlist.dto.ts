import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinWaitlistDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email of the user who wants to join the waitlist',
    example: 'oraculoai.bot@gmail.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Slug of the agent the user wants to join the waitlist for',
    example: 'agent-slug',
  })
  // FIXME: this should make sure the slug is a valid agent slug
  agentSlug: string;
}
