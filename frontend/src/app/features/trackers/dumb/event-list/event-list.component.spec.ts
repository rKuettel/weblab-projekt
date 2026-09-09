import { inputBinding, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { TrackerEvent } from '../../events.types';
import { EventListComponent } from './event-list.component';
import { makeEvent } from '../../../../../../test/test-utils';

describe('EventList', () => {
  const events: TrackerEvent[] = [
    makeEvent({ id: 'e1', timestamp: new Date('2024-06-10T10:00:00Z'), data: { delta: 10 } }),
    makeEvent({ id: 'e2', timestamp: new Date('2024-06-12T10:00:00Z'), data: { delta: 20 } }),
    makeEvent({ id: 'e3', timestamp: new Date('2024-06-11T10:00:00Z'), data: { delta: 30 } }),
  ];

  async function setup(list: TrackerEvent[] = events) {
    await TestBed.configureTestingModule({
      imports: [EventListComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(EventListComponent, {
      bindings: [inputBinding('events', signal(list))],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      eventBlocks: fixture.nativeElement.querySelectorAll('.event'),
    };
  }

  it('should render events sorted by most recent first', async () => {
    const { fixture, eventBlocks } = await setup();
    expect(eventBlocks.length).toBe(3);

    const text = fixture.nativeElement.textContent;
    expect(text.indexOf('Data: 20')).toBeLessThan(text.indexOf('Data: 30'));
    expect(text.indexOf('Data: 30')).toBeLessThan(text.indexOf('Data: 10'));
    expect(eventBlocks[0].textContent).toContain('Data: 20');
    expect(eventBlocks[0].textContent).toContain('Timestamp:');
  });

  it('should emit the event id when delete is clicked', async () => {
    const { component, eventBlocks } = await setup();
    const onDelete = vi.fn();
    component.onDelete.subscribe(onDelete);

    const buttons = eventBlocks[0].querySelectorAll('button');
    expect(buttons.length).toBe(1);

    (buttons[0] as HTMLButtonElement).click();

    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith('e2');
  });
});
