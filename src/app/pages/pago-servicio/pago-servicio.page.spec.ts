import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PagoServicioPage } from './pago-servicio.page';

describe('PagoServicioPage', () => {
  let component: PagoServicioPage;
  let fixture: ComponentFixture<PagoServicioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoServicioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
