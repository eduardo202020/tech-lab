export type DeviceType = 'smart_parking' | 'people_counter' | 'lora';

export interface ProjectDeviceRecord {
  id: string;
  project_id: string;
  device_type: DeviceType;
  name: string;
  identifier: string;
  secondary_identifier?: string | null;
  refresh_ms?: number | null;
  enabled: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}
