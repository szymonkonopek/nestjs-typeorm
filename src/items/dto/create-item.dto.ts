import { CreatListingDto } from './create-listing.dto';
import { CreateTagDto } from './create-tag.dto';

export class CreateItemDto {
  name: string;
  public: boolean;
  listing: CreatListingDto;
  tags: CreateTagDto[];
}
