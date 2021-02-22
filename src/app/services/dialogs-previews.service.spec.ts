import { TestBed } from '@angular/core/testing';

import { DialogsPreviewsService } from './dialogs-previews.service';

describe('DialogsPreviewsService', () => {
  let service: DialogsPreviewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogsPreviewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
