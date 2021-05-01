import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowNotifComponent } from './show-notif.component';

describe('ShowNotifComponent', () => {
  let component: ShowNotifComponent;
  let fixture: ComponentFixture<ShowNotifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowNotifComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
