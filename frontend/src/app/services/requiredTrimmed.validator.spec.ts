import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { requiredTrimmed } from './requiredTrimmed.validator';

beforeEach(() => {
  TestBed.configureTestingModule({});
});

function createForm(
  value: string,
  message: WritableSignal<string> = signal('This field is required'),
) {
  return TestBed.runInInjectionContext(() => {
    const model = signal(value);
    return form(model, (schema) => requiredTrimmed(schema, message));
  });
}

describe('requiredTrimmed', () => {
  it('should reject an empty string', () => {
    const formRef = createForm('');
    const state = formRef();

    expect(state.invalid()).toBe(true);
    expect(state.errors().map((e) => e.kind)).toEqual(['required-trimmed']);
    expect(state.errors()[0].message).toBe('This field is required');
  });

  it('should reject a whitespace-only string', () => {
    const formRef = createForm('   ');
    const state = formRef();

    expect(state.invalid()).toBe(true);
    expect(state.errors().map((e) => e.kind)).toEqual(['required-trimmed']);
  });

  it('should accept a non-empty string', () => {
    const formRef = createForm('hello');
    const state = formRef();

    expect(state.valid()).toBe(true);
    expect(state.errors()).toEqual([]);
  });

  it('should reject non-string values', () => {
    const formRef = createForm(undefined as unknown as string);
    const state = formRef();

    expect(state.invalid()).toBe(true);
    expect(state.errors().map((e) => e.kind)).toEqual(['required-trimmed']);
  });

  it('should use the current message from the message signal', () => {
    const message = signal('First message');
    const formRef = createForm('', message);

    expect(formRef().errors()[0].message).toBe('First message');

    message.set('Second message');
    expect(formRef().errors()[0].message).toBe('Second message');
  });
});
