import { Signal } from '@angular/core';
import { SchemaPath, validate } from '@angular/forms/signals';

export function requiredTrimmed<T>(path: SchemaPath<T>, message: Signal<string>) {
  return validate(path, ({ value }) => {
    const currentValue = value();

    if (typeof currentValue !== 'string' || currentValue.trim() === '') {
      return {
        kind: 'required-trimmed',
        message: message(),
      };
    }
    return null;
  });
}
