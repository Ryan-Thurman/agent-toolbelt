import { formatName } from './format.js';
// Published compatibility interface, also used by dynamic consumers.
export function displayName(name) { return formatName(name); }
