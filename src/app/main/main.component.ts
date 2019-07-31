import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  todos$ = this.todoService.getTodoList();
  destroy$ = new Subject();

  degree = 180;

  c = 270;
  r = 270;

  svgPathDefine = '';
  constructor(private todoService: TodoService) {}

  ngOnInit() {
    interval(500).pipe(takeUntil(this.destroy$)).subscribe(_ => {
      this.degree += 10;
      this.degree = this.degree % 360;
      this.svgPathDefine = this.describeArc(this.c + 2, this.c + 2, this.r, 0, this.degree);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }

  describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);

    const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

    const d = ['M', start.x, start.y, 'A', radius, radius, 0, arcSweep, 0, end.x, end.y, 'L', x, y, 'L', start.x, start.y].join(' ');

    // console.log(d);

    return d;
  }
}
