/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PricelistComponent } from './pricelist.component';

describe('PricelistComponent', () => {
  let component: PricelistComponent;
  let fixture: ComponentFixture<PricelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
