import { Expose } from 'class-transformer';

class GetVehiclesDTO {
  @Expose({ name: 'limit' })
  public limit: number;

  @Expose({ name: 'page_token' })
  public pageToken: string;

  constructor(limit: number, pageToken: string) {
    this.limit = limit;
    this.pageToken = pageToken;  
  }
}

export = GetVehiclesDTO