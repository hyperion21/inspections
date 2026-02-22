import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  findAll() {
    return this.locationsRepository.find();
  }

  create(data: Partial<Location>) {
    const loc = this.locationsRepository.create(data);
    return this.locationsRepository.save(loc);
  }
}
