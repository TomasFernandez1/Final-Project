import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = join(dirname(__filename), '..');

export const extractRelativePath = (url) => {
    const newUrl = new URL(url);
    const parsedUrl = newUrl.pathname.startsWith('/') ? newUrl.pathname.slice(1) : newUrl.pathname;
    return join(__dirname + "/public", parsedUrl);
};