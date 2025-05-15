import { TestBed } from '@angular/core/testing';

import { ActivityReportService } from './activity-report.service';

describe('ActivityReportService', () => {
  let service: ActivityReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
