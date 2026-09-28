import { globalOptions } from '../globalOptions';
import { createI18n } from '../../../modules/i18n';

// Read the shared options on each call so changes take effect immediately.
export default createI18n(() => globalOptions.other.language);
