
export function getNewLineCount(message: string): number {
    return message.split(/\r\n|\r|\n/).length;
}