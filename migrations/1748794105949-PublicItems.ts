import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class PublicItems1748794105949 implements MigrationInterface {
  private readonly logger = new Logger(PublicItems1748794105949.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Up');
    await queryRunner.query('Update item SET public = 1');
  }

  public async down(): Promise<void> {
    this.logger.log('Down');
  }
}
