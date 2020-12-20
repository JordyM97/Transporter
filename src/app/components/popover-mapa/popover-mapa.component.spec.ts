import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverMapaComponent } from './popover-mapa.component';

describe('PopoverMapaComponent', () => {
  let component: PopoverMapaComponent;
  let fixture: ComponentFixture<PopoverMapaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverMapaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
