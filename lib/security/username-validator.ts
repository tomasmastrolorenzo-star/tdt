import { INSTAGRAM_REGEX, TIKTOK_REGEX } from './regex-constants';

type Platform = 'instagram' | 'tiktok';

interface ValidationResult {
    valid: boolean;
    msg?: string;
}

export function validateUser(username: string, platform: Platform = 'instagram'): ValidationResult {
    if (!username) return { valid: false, msg: "Username is required." };

    const regex = platform === 'tiktok' ? TIKTOK_REGEX : INSTAGRAM_REGEX;

    if (!regex.test(username)) {
        return {
            valid: false,
            msg: "Invalid Username. Only letters, numbers, '.' and '_' allowed. No spaces or special chars."
        };
    }

    return { valid: true };
}
