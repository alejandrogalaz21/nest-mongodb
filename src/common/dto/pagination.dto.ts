import { IsOptional, IsPositive, Min } from 'class-validator'

export class PaginationDTO {
  @IsOptional()
  @IsPositive()
  @Min(1)
  limit?: number

  @IsOptional()
  @IsPositive()
  @Min(1)
  offset?: number
}
