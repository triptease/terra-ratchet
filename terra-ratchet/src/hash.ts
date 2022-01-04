import {BinaryLike, createHash, randomBytes} from 'crypto';

export function hashSHA256(value: BinaryLike): string {
    return createHash('sha256').update(value).digest('hex');
}

export function randomHash(): string {
    return hashSHA256(randomBytes(256 / 8));
}