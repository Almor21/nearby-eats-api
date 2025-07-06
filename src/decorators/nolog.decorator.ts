import { SetMetadata } from '@nestjs/common';

export const NO_LOG_KEY = 'NO_LOG_KEY';

export const Nolog = () => SetMetadata(NO_LOG_KEY, true);
