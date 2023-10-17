import BootService from './boot.service';

on('onServerResourceStart', async (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    await BootService.handleResourceStarting();
  }
});
