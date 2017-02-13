/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DailyCropService } from './daily-crop.service';

describe('DailyCropService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DailyCropService]
    });
  });

  it('should ...', inject([DailyCropService], (service: DailyCropService) => {
    expect(service).toBeTruthy();
  }));
});
