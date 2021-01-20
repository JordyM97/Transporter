import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HistorialDetallePage } from './historial-detalle.page';

describe('HistorialDetallePage', () => {
  let component: HistorialDetallePage;
  let fixture: ComponentFixture<HistorialDetallePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialDetallePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
