export interface error {
    code: string
    message: string
}

export function isError(obj: any): obj is error {
    return typeof obj === 'object' && obj !== null &&
        'code' in obj && 'message' in obj
}