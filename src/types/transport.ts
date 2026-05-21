// ==================== TRANSPORT MODULE TYPES ====================
// Based on backend API: /api/v1/transport/*

// Transport Statistics
export interface TransportStats {
  total_buses: number;
  active_buses: number;
  total_routes: number;
  active_routes: number;
  total_passes_issued: number;
  active_passes: number;
  pending_maintenance: number;
}

// Buses
export interface Bus {
  id: number;
  bus_number: string;
  registration_no: string;
  capacity: number;
  bus_type: 'ac' | 'non_ac' | 'deluxe';
  fuel_type: 'diesel' | 'petrol' | 'cng' | 'electric';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  current_assignment?: BusAssignment;
  maintenance_records?: TransportMaintenance[];
}

export interface CreateBus {
  bus_number: string;
  registration_no: string;
  capacity: number;
  bus_type?: 'ac' | 'non_ac' | 'deluxe';
  fuel_type?: 'diesel' | 'petrol' | 'cng' | 'electric';
  is_active?: boolean;
}

export interface UpdateBus {
  bus_number?: string;
  registration_no?: string;
  capacity?: number;
  bus_type?: 'ac' | 'non_ac' | 'deluxe';
  fuel_type?: 'diesel' | 'petrol' | 'cng' | 'electric';
  is_active?: boolean;
}

// Routes
export interface Route {
  id: number;
  route_name: string;
  description?: string;
  distance_km: number;
  estimated_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  stops?: RouteStop[];
  assignments?: BusAssignment[];
}

export interface CreateRoute {
  route_name: string;
  description?: string;
  distance_km: number;
  estimated_time: string;
  is_active?: boolean;
}

export interface UpdateRoute {
  route_name?: string;
  description?: string;
  distance_km?: number;
  estimated_time?: string;
  is_active?: boolean;
}

// Route Stops
export interface RouteStop {
  id: number;
  route_id: number;
  stop_name: string;
  stop_order: number;
  latitude?: number;
  longitude?: number;
  arrival_time: string;
  departure_time: string;
  landmark?: string;
  created_at: string;
  updated_at: string;
  route?: Route;
}

export interface CreateRouteStop {
  route_id: number;
  stop_name: string;
  stop_order: number;
  latitude?: number;
  longitude?: number;
  arrival_time: string;
  departure_time: string;
  landmark?: string;
}

export interface UpdateRouteStop {
  stop_name?: string;
  stop_order?: number;
  latitude?: number;
  longitude?: number;
  arrival_time?: string;
  departure_time?: string;
  landmark?: string;
}

// Bus Assignments
export interface BusAssignment {
  id: number;
  bus_id: number;
  route_id: number;
  driver_id?: number;
  conductor_id?: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  bus?: Bus;
  route?: Route;
  driver?: Employee;
  conductor?: Employee;
}

export interface CreateBusAssignment {
  bus_id: number;
  route_id: number;
  driver_id?: number;
  conductor_id?: number;
}

export interface UpdateBusAssignment {
  driver_id?: number;
  conductor_id?: number;
  end_date?: string;
  is_active?: boolean;
}

// Transport Passes
export interface TransportPass {
  id: number;
  student_id: number;
  route_id: number;
  pickup_stop_id: number;
  drop_stop_id: number;
  pass_number: string;
  valid_from: string;
  valid_to: string;
  fee_paid: number;
  status: 'active' | 'expired' | 'cancelled' | 'suspended';
  issued_date: string;
  created_at: string;
  updated_at: string;
  student?: Student;
  route?: Route;
  pickup_stop?: RouteStop;
  drop_stop?: RouteStop;
}

export interface CreateTransportPass {
  student_id: number;
  route_id: number;
  pickup_stop_id: number;
  drop_stop_id: number;
  valid_from: string;
  valid_to: string;
  fee_paid: number;
}

export interface RenewTransportPass {
  valid_to: string;
  fee_paid: number;
}

// Transport Maintenance
export interface TransportMaintenance {
  id: number;
  bus_id: number;
  description: string;
  cost: number;
  maintenance_type: 'routine' | 'repair' | 'replacement' | 'inspection';
  performed_by?: string;
  performed_date?: string;
  next_due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
  bus?: Bus;
}

export interface CreateTransportMaintenance {
  bus_id: number;
  description: string;
  cost: number;
  maintenance_type?: 'routine' | 'repair' | 'replacement' | 'inspection';
  performed_by?: string;
  performed_date?: string;
  next_due_date: string;
}

export interface UpdateTransportMaintenance {
  description?: string;
  cost?: number;
  maintenance_type?: 'routine' | 'repair' | 'replacement' | 'inspection';
  performed_by?: string;
  performed_date?: string;
  next_due_date?: string;
  status?: 'pending' | 'in_progress' | 'completed';
}

// Import types from other modules
interface Student {
  id: number;
  university_reg_no: string;
  first_name: string;
  last_name: string;
}

interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
}
