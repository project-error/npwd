export class BaseError extends Error {
  code = 500;
  error_code = 'INTERNAL_SERVER_ERROR';

  constructor(message: string) {
    super(message);
  }
}

export class CallNotFoundError extends BaseError {
  code = 404;
  error_code = 'CALL_NOT_FOUND' as const;

  constructor() {
    super('Call not found');
  }
}

export class PendingCallNotFoundError extends BaseError {
  code = 404;
  error_code = 'PENDING_CALL_NOT_FOUND' as const;

  constructor() {
    super('Pending call not found');
  }
}

export class CallAlreadyAcceptedError extends BaseError {
  code = 400;
  error_code = 'CALL_ALREADY_ACCEPTED' as const;

  constructor() {
    super('Call already accepted');
  }
}

export class CallHasEndedError extends BaseError {
  code = 400;
  error_code = 'CALL_HAS_ENDED' as const;

  constructor() {
    super('Call has ended');
  }
}

export class DeviceNotFoundError extends BaseError {
  code = 404;
  declare error_code: 'CALLER_DEVICE_NOT_FOUND' | 'RECEIVER_DEVICE_NOT_FOUND';

  constructor(type: 'CALLER' | 'RECEIVER') {
    super(`Device for ${type} not found`);
    this.error_code = `${type}_DEVICE_NOT_FOUND`;
  }
}

export class SimcardNotFoundError extends BaseError {
  code = 404;
  declare error_code: 'CALLER_SIM_CARD_NOT_FOUND' | 'RECEIVER_SIM_CARD_NOT_FOUND';

  constructor(type: 'CALLER' | 'RECEIVER') {
    super(`Sim card for ${type} not found`);
    this.error_code = `${type}_SIM_CARD_NOT_FOUND`;
  }
}

export class SimCardNotActiveError extends BaseError {
  code = 400;
  declare error_code: 'CALLER_SIM_CARD_NOT_ACTIVE' | 'RECEIVER_SIM_CARD_NOT_ACTIVE';

  constructor(type: 'CALLER' | 'RECEIVER') {
    super(`Sim card for ${type} is not active`);
    this.error_code = `${type}_SIM_CARD_NOT_ACTIVE` as const;
  }
}

export class PhoneNumberAlreadyRegisteredError extends BaseError {
  code = 400;
  error_code = 'PHONE_NUMBER_ALREADY_REGISTERED' as const;

  constructor() {
    super('Phone number already registered');
  }
}

export class PhoneNumberNotFoundError extends BaseError {
  code = 404;
  error_code = 'PHONE_NUMBER_NOT_FOUND' as const;

  constructor() {
    super('Phone number not found');
  }
}

export class InvalidPhoneNumberError extends BaseError {
  code = 400;
  error_code = 'INVALID_PHONE_NUMBER' as const;

  constructor() {
    super('Invalid phone number');
  }
}

export class UnauthorizedError extends BaseError {
  code = 401;
  error_code = 'UNAUTHORIZED' as const;

  constructor() {
    super('Unauthorized');
  }
}

export class OngoingCallError extends BaseError {
  code = 400;
  error_code = 'ONGOING_CALL' as const;

  constructor() {
    super('Ongoing call');
  }
}

export type ErrorCodes =
  | CallNotFoundError
  | CallAlreadyAcceptedError
  | CallHasEndedError
  | DeviceNotFoundError
  | SimcardNotFoundError
  | SimCardNotActiveError
  | PhoneNumberAlreadyRegisteredError
  | PhoneNumberNotFoundError
  | InvalidPhoneNumberError
  | UnauthorizedError
  | OngoingCallError;

export type ErrorCode = ErrorCodes['error_code'];
