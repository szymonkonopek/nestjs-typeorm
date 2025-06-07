import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { EntityManager, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { Comment } from './entities/comment.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createItemDto: CreateItemDto) {
    console.log('DTO:', createItemDto);

    const listing = this.entityManager.create(Listing, {
      ...createItemDto.listing,
      rating: 0,
    });

    const tags = createItemDto.tags.map((tag) => {
      console.log('Tag:', tag);
      return this.entityManager.create(Tag, {
        ...tag,
      });
    });

    const item = this.entityManager.create(Item, {
      ...createItemDto, // przypisze: name, public
      listing, // nadpisze plain listing z DTO
      comments: [], // zapewni pustą tablicę
      tags,
    });
    console.log('Item before save:', item);

    await this.entityManager.save(item);
  }

  async findAll() {
    return this.itemsRepository.find({
      relations: ['comments', 'tags'],
    });
  }

  async findOne(id: number) {
    return this.itemsRepository.findOne({
      where: { id },
      relations: { listing: true, comments: true, tags: true },
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.itemsRepository.findOneBy({ id });
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    console.log('updateItemDto:', updateItemDto);

    item.public = updateItemDto.public;

    const comments = updateItemDto.comments.map((createCommentDto) => {
      console.log('createCommentDto:', createCommentDto);
      return this.entityManager.create(Comment, {
        ...createCommentDto,
      });
    });

    item.comments = comments;

    return this.itemsRepository.save(item);
  }

  async update_transaction(id: number, updateItemDto: UpdateItemDto) {
    await this.entityManager.transaction(async (entityManager) => {
      const item = await this.itemsRepository.findOneBy({ id });
      if (!item) {
        throw new Error(`Item with id ${id} not found`);
      }

      item.public = updateItemDto.public;

      const comments = updateItemDto.comments.map((createCommentDto) => {
        console.log('createCommentDto:', createCommentDto);
        return entityManager.create(Comment, {
          ...createCommentDto,
        });
      });

      item.comments = comments;

      await this.itemsRepository.save(item);

      const tagContent = `${Math.random()}`;
      const tag = entityManager.create(Tag, {
        content: tagContent,
      });
      await entityManager.save(tag);
    });
  }

  async remove(id: number) {
    await this.itemsRepository.delete(id);
  }
}
