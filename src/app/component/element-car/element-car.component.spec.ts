import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementCarComponent } from './element-car.component';

describe('ElementCarComponent', () => {
  let component: ElementCarComponent;
  let fixture: ComponentFixture<ElementCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementCarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
