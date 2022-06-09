export class _KvpService {
  setKvp(key: string, value: any): void {
    SetResourceKvp(key, value);
  }

  setKvpFloat(key: string, value: number): void {
    SetResourceKvpFloat(key, value);
  }

  setKvpInt(key: string, value: number): void {
    SetResourceKvpInt(key, value);
  }

  getKvpString(key: string): string {
    return GetResourceKvpString(key);
  }

  getKvpInt(key: string): number {
    return GetResourceKvpInt(key);
  }

  getKvpFloat(key: string): number {
    return GetResourceKvpFloat(key);
  }
}
const KvpService = new _KvpService();
export default KvpService;
