import apps from './apps';

function sendMessage(app: string, method: string, data: any) {
    return SendNuiMessage(JSON.stringify({
        app,
        method,
        data,
    }))
}

export function sendTwitterMessage(method: string, data: any = {}) {
    return sendMessage(apps.TWITTER, method, data);
}
