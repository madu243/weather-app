import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WeatherService } from './weather.service';
interface Country {
  shortName: string;
  name: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  countries: Country[];
  states: string[];
  cities: string[];

  countryControl: FormControl;
  cityControl: FormControl;
  stateControl: FormControl;

  constructor(private router: Router, private weatherService: WeatherService) {}

  ngOnInit() {
    this.cityControl = new FormControl('');
    this.countryControl = new FormControl('');
    this.stateControl = new FormControl('');

    this.cityControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        this.router.navigate([value]);
      });

    this.countries = this.weatherService.getCountries();

    this.countryControl.valueChanges.subscribe((country) => {
      this.stateControl.reset();
      this.stateControl.disable();
      if (country) {
        this.states = this.weatherService.getStatesByCountry(country.shortName);
        console.log(this.states);
        this.stateControl.enable();
      }
    });

    this.stateControl.valueChanges.subscribe((state) => {
      if (state) {
        this.cities = this.weatherService.getCitiesByState(
          this.countryControl.value.shortName,
          state
        );
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
