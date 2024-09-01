import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Subscription, fromEvent } from 'rxjs'

import { DateTime } from 'luxon'
import { FormsModule } from '@angular/forms'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { debounceTime } from 'rxjs/operators'
import { provideNativeDateAdapter } from '@angular/material/core'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'event-countdown-app'
  today = DateTime.local().toJSDate()
  nextYear = DateTime.now().year + 1
  midsummerDayNextYear = DateTime.fromObject({
    year: this.nextYear,
    month: 6,
    day: 24,
  })
  eventName = 'Midsummer Eve'
  eventDate = this.midsummerDayNextYear.toJSDate()
  remainingTime: {
    days: number
    hours: number
    minutes: number
    seconds: number
  } = { days: 7, hours: 0, minutes: 0, seconds: 0 }
  totalSeconds: number = 0
  intervalId: any

  private resizeSubscription: Subscription | null = null

  private readonly _currentYear = new Date().getFullYear()
  readonly minDate = DateTime.local().toJSDate()
  readonly maxDate = new Date(this._currentYear + 1, 11, 31)

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const storedEventName = sessionStorage.getItem('eventName')
    const storedEventDate = sessionStorage.getItem('eventDate')
    if (storedEventName && storedEventDate) {
      this.eventName = storedEventName
      this.eventDate = new Date(storedEventDate)
    }
    this.startCountdown()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {}
  @ViewChild('eventTitle', { static: false }) eventTitle!: ElementRef
  @ViewChild('remainingDateTime', { static: false })
  remainingDateTime!: ElementRef
  private minFontSize = 10 // Min font-size px
  private maxFontSize = 280 // Max font-size px

  ngAfterViewInit() {
    this.fitText()
    requestAnimationFrame(() => {
      this.fitText()
    })

    fromEvent(window, 'resize')
      .pipe(debounceTime(150))
      .subscribe(() => {
        this.fitText()
      })
  }

  convertToTotalSeconds(endDateTime: Date): number {
    const start = DateTime.local()
    const end = DateTime.fromJSDate(endDateTime)

    const diffInSeconds = end.diff(start, 'seconds').seconds

    return diffInSeconds
  }

  public onInputChange() {
    sessionStorage.setItem('eventName', this.eventName)
    sessionStorage.setItem('eventDate', this.eventDate?.toISOString())

    this.startCountdown()
    this.fitText()
  }

  public fitText() {
    const containerWidth =
      this.eventTitle.nativeElement.parentElement.clientWidth
    if (containerWidth) {
      let eventNameFontSize = this.findOptimalFontSize(
        containerWidth,
        this.eventTitle,
      )
      let eventDateFontSize = this.findOptimalFontSize(
        containerWidth,
        this.remainingDateTime,
      )
      this.eventTitle.nativeElement.style.fontSize = `${eventNameFontSize}px`
      this.remainingDateTime.nativeElement.style.fontSize = `${eventDateFontSize}px`

      // If the text still doesn't fit, apply a fallback
      if (this.eventTitle.nativeElement.scrollWidth > containerWidth) {
        this.eventTitle.nativeElement.style.overflow = 'hidden'
        this.eventTitle.nativeElement.style.textOverflow = 'ellipsis'
      } else {
        this.eventTitle.nativeElement.style.overflow = 'visible'
      }
      if (this.remainingDateTime.nativeElement.scrollWidth > containerWidth) {
        this.remainingDateTime.nativeElement.style.overflow = 'hidden'
        this.remainingDateTime.nativeElement.style.textOverflow = 'ellipsis'
      } else {
        this.remainingDateTime.nativeElement.style.overflow = 'visible'
      }
    }
  }

  // Binary search to find the maximum fitting font size
  private findOptimalFontSize(
    containerWidth: number,
    element: ElementRef,
  ): number {
    let low = this.minFontSize
    let high = this.maxFontSize

    while (low < high) {
      let mid = Math.ceil((low + high) / 2)
      element.nativeElement.style.fontSize = `${mid}px`

      if (element.nativeElement.scrollWidth <= containerWidth) {
        low = mid
      } else {
        high = mid - 1
      }
    }

    return low // Return the largest font
  }

  updateTime() {
    this.totalSeconds = this.convertToTotalSeconds(this.eventDate)
    this.remainingTime = {
      days: Math.floor(this.totalSeconds / 86400),
      hours: Math.floor((this.totalSeconds % 86400) / 3600),
      minutes: Math.floor((this.totalSeconds % 3600) / 60),
      seconds: Math.floor(this.totalSeconds % 60),
    }
  }

  startCountdown() {
    this.updateTime()
    this.intervalId = setInterval(() => {
      if (this.totalSeconds > 0) {
        this.totalSeconds--
        this.updateTime()
        this.cdr.detectChanges()
      } else {
        this.stopCountdown()
      }
    }, 1000)
  }

  stopCountdown() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  ngOnDestroy(): void {
    this.stopCountdown()
    this.resizeSubscription?.unsubscribe()
  }
}
