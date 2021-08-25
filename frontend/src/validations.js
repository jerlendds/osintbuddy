import {extend} from 'vee-validate';
import {
  required,
  email,
  alpha_spaces,
  confirmed,
  max,
  min,
} from 'vee-validate/dist/rules';

extend('min', {
  ...min,
  params: ['length'],
  message: '{_field_} must be at least {length} characters',
});

extend('password', {
  params: ['target'],
  validate(value, {target}) {
    return value === target;
  },
  message: (fieldName, placeholders) => {
    var lowered = String(fieldName.toLowerCase());
    if (placeholders._target_ == '') {
      return `Confirm your ${lowered} below`;
    }
    if (placeholders._value_ != placeholders._target_) {
      return 'Please ensure your passwords match';
    }
  },
});

extend('max', max);

extend('email', {
  ...email,
  message: fieldName => {
    var lowered = fieldName.toLowerCase();
    return `Please enter a valid ${lowered}`;
  },
});

extend('alpha_spaces', alpha_spaces);

extend('confirmed', {
  ...confirmed,
});

extend('required', {
  ...required,
  params: ['target'],
  message: fieldName => {
    return `${fieldName} required`;
  },
});
