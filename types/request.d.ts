import { ServiceConfiguration, RequestData, Server } from './types';
export default function request(config: ServiceConfiguration, data: RequestData, server: Server): Promise<unknown>;
