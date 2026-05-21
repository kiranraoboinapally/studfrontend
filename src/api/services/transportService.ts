// ==================== TRANSPORT SERVICE ====================
// Based on backend API: /api/v1/transport/*
import api from '../axios';
import type { 
  TransportStats,
  Bus,
  CreateBus,
  UpdateBus,
  Route,
  CreateRoute,
  UpdateRoute,
  RouteStop,
  CreateRouteStop,
  UpdateRouteStop,
  BusAssignment,
  CreateBusAssignment,
  UpdateBusAssignment,
  TransportPass,
  CreateTransportPass,
  RenewTransportPass,
  TransportMaintenance,
  CreateTransportMaintenance,
  UpdateTransportMaintenance,
  ApiResponse,
  PaginatedResponse,
  QueryFilters
} from '../../types';

const TRANSPORT_BASE = '/transport';

// Transport Statistics
export const transportStatsService = {
  getStats: async (): Promise<ApiResponse<TransportStats>> => {
    const response = await api.get<ApiResponse<TransportStats>>(`${TRANSPORT_BASE}/stats`);
    return response.data;
  },
};

// Buses
export const busService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<Bus>> => {
    const response = await api.get<PaginatedResponse<Bus>>(`${TRANSPORT_BASE}/buses`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Bus>> => {
    const response = await api.get<ApiResponse<Bus>>(`${TRANSPORT_BASE}/buses/${id}`);
    return response.data;
  },

  create: async (data: CreateBus): Promise<ApiResponse<Bus>> => {
    const response = await api.post<ApiResponse<Bus>>(`${TRANSPORT_BASE}/buses`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateBus): Promise<ApiResponse<Bus>> => {
    const response = await api.put<ApiResponse<Bus>>(`${TRANSPORT_BASE}/buses/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${TRANSPORT_BASE}/buses/${id}`);
    return response.data;
  },
};

// Routes
export const routeService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<Route>> => {
    const response = await api.get<PaginatedResponse<Route>>(`${TRANSPORT_BASE}/routes`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Route>> => {
    const response = await api.get<ApiResponse<Route>>(`${TRANSPORT_BASE}/routes/${id}`);
    return response.data;
  },

  create: async (data: CreateRoute): Promise<ApiResponse<Route>> => {
    const response = await api.post<ApiResponse<Route>>(`${TRANSPORT_BASE}/routes`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateRoute): Promise<ApiResponse<Route>> => {
    const response = await api.put<ApiResponse<Route>>(`${TRANSPORT_BASE}/routes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${TRANSPORT_BASE}/routes/${id}`);
    return response.data;
  },
};

// Route Stops
export const routeStopService = {
  getAll: async (routeId?: number): Promise<ApiResponse<RouteStop[]>> => {
    const params = routeId ? { route_id: routeId } : {};
    const response = await api.get<ApiResponse<RouteStop[]>>(`${TRANSPORT_BASE}/stops`, { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<RouteStop>> => {
    const response = await api.get<ApiResponse<RouteStop>>(`${TRANSPORT_BASE}/stops/${id}`);
    return response.data;
  },

  create: async (data: CreateRouteStop): Promise<ApiResponse<RouteStop>> => {
    const response = await api.post<ApiResponse<RouteStop>>(`${TRANSPORT_BASE}/stops`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateRouteStop): Promise<ApiResponse<RouteStop>> => {
    const response = await api.put<ApiResponse<RouteStop>>(`${TRANSPORT_BASE}/stops/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${TRANSPORT_BASE}/stops/${id}`);
    return response.data;
  },
};

// Bus Assignments
export const busAssignmentService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<BusAssignment>> => {
    const response = await api.get<PaginatedResponse<BusAssignment>>(`${TRANSPORT_BASE}/bus-assignments`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<BusAssignment>> => {
    const response = await api.get<ApiResponse<BusAssignment>>(`${TRANSPORT_BASE}/bus-assignments/${id}`);
    return response.data;
  },

  create: async (data: CreateBusAssignment): Promise<ApiResponse<BusAssignment>> => {
    const response = await api.post<ApiResponse<BusAssignment>>(`${TRANSPORT_BASE}/bus-assignments`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateBusAssignment): Promise<ApiResponse<BusAssignment>> => {
    const response = await api.put<ApiResponse<BusAssignment>>(`${TRANSPORT_BASE}/bus-assignments/${id}`, data);
    return response.data;
  },

  endAssignment: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`${TRANSPORT_BASE}/bus-assignments/${id}/end`);
    return response.data;
  },
};

// Transport Passes
export const transportPassService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<TransportPass>> => {
    const response = await api.get<PaginatedResponse<TransportPass>>(`${TRANSPORT_BASE}/passes`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<TransportPass>> => {
    const response = await api.get<ApiResponse<TransportPass>>(`${TRANSPORT_BASE}/passes/${id}`);
    return response.data;
  },

  getStudentPasses: async (studentId: number): Promise<ApiResponse<TransportPass[]>> => {
    const response = await api.get<ApiResponse<TransportPass[]>>(`${TRANSPORT_BASE}/passes`, { params: { student_id: studentId } });
    return response.data;
  },

  issuePass: async (data: CreateTransportPass): Promise<ApiResponse<TransportPass>> => {
    const response = await api.post<ApiResponse<TransportPass>>(`${TRANSPORT_BASE}/passes/issue`, data);
    return response.data;
  },

  renewPass: async (id: number, data: RenewTransportPass): Promise<ApiResponse<TransportPass>> => {
    const response = await api.post<ApiResponse<TransportPass>>(`${TRANSPORT_BASE}/passes/${id}/renew`, data);
    return response.data;
  },

  cancelPass: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`${TRANSPORT_BASE}/passes/${id}/cancel`);
    return response.data;
  },
};

// Transport Maintenance
export const transportMaintenanceService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<TransportMaintenance>> => {
    const response = await api.get<PaginatedResponse<TransportMaintenance>>(`${TRANSPORT_BASE}/maintenance`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<TransportMaintenance>> => {
    const response = await api.get<ApiResponse<TransportMaintenance>>(`${TRANSPORT_BASE}/maintenance/${id}`);
    return response.data;
  },

  getBusMaintenance: async (busId: number): Promise<ApiResponse<TransportMaintenance[]>> => {
    const response = await api.get<ApiResponse<TransportMaintenance[]>>(`${TRANSPORT_BASE}/maintenance`, { params: { bus_id: busId } });
    return response.data;
  },

  create: async (data: CreateTransportMaintenance): Promise<ApiResponse<TransportMaintenance>> => {
    const response = await api.post<ApiResponse<TransportMaintenance>>(`${TRANSPORT_BASE}/maintenance`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateTransportMaintenance): Promise<ApiResponse<TransportMaintenance>> => {
    const response = await api.put<ApiResponse<TransportMaintenance>>(`${TRANSPORT_BASE}/maintenance/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${TRANSPORT_BASE}/maintenance/${id}`);
    return response.data;
  },
};

// Default export as object
export default { 
  stats: transportStatsService,
  buses: busService,
  routes: routeService,
  stops: routeStopService,
  assignments: busAssignmentService,
  passes: transportPassService,
  maintenance: transportMaintenanceService,
};
