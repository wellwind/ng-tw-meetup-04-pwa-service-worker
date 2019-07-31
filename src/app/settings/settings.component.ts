import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import * as shortid from 'shortid';
import { ConnectionService } from '../connection.service';
import { TodoItem } from '../todo-item';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  isOffline$ = this.connectionService.offline$;
  refresh$ = new BehaviorSubject<void>(undefined);

  todoItems$ = this.refresh$.pipe(
    switchMap(_ => this.todoService.getTodoList()),
    shareReplay()
  );

  doingItems$ = this.todoItems$.pipe(map(items => items.filter(item => !item.done)));

  doneItems$ = this.todoItems$.pipe(map(items => items.filter(item => item.done)));

  constructor(private todoService: TodoService, private connectionService: ConnectionService) {}

  ngOnInit() {}

  trackByFn(index: number) {
    return index;
  }

  repeat(count: number) {
    const result = [];
    for (let i = 0; i < count; ++i) {
      result.push(null);
    }
    return result;
  }

  addTodo(input: HTMLInputElement) {
    if (!input.value || !input.value.trim()) {
      return;
    }

    this.todoService
      .addTodo({
        id: shortid(),
        name: input.value,
        done: false,
        pomodoros: 0
      })
      .subscribe(_ => {
        this.refresh$.next();
        input.value = '';
        input.focus();
      });
  }

  toggleTodo(item: TodoItem) {
    this.todoService.toggleTodo(item).subscribe(_ => {
      this.refresh$.next();
    });
  }
}
