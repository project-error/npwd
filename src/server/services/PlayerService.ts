class PlayerService {
  deviceMap: Map<number, string> = new Map();
  constructor() {}

  public authorizeDevice(src: number, deviceIdentifier: string) {
    return true;
  }

  public async selectDevice(src: number, deviceIdentifier: string) {
    if (!this.authorizeDevice(src, deviceIdentifier)) {
      throw new Error('Unauthorized');
    }

    this.deviceMap.set(src, deviceIdentifier);
  }

  public getDevice(src: number) {
    return this.deviceMap.get(src);
  }

  public async getDevices() {
    return Array.from(this.deviceMap.values());
  }
}

export default new PlayerService();
