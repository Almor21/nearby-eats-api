import { IsNumber, IsOptional, IsPositive, Max } from "class-validator";

export class FindNearbyRestaurantsDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(50000)
  radius?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(20)
  limit?: number;
}