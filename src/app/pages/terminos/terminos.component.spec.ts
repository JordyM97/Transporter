import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TerminosComponent } from './terminos.component';

describe('TerminosComponent', () => {
  let component: TerminosComponent;
  let fixture: ComponentFixture<TerminosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TerminosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
