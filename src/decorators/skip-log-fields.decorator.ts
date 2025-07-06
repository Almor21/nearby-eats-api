import { SetMetadata } from '@nestjs/common';

export const SKIP_LOG_FIELDS = 'SKIP_LOG_FIELDS';

export const SkipLogFields = (args: {
  request?: string[];
  response?: string[];
}) => SetMetadata(SKIP_LOG_FIELDS, args);
