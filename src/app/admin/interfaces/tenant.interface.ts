export interface Tenant {
    id?:             number;
    tel:            string | undefined;
    terms_accepted: number | undefined;
    business_name:  string | undefined;
    country:        string | undefined;
    id_user?:        number;
    created_at?:     Date;
    updated_at?:     Date;
    social_networks?: SocialNetworks;
    logo?: string;
    address?:string;
    schedule? : TenantSchedule;
}

export interface SocialNetworks {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
  }

  export interface BusinessHour {
    day_of_week: string;    // Día de la semana (Lunes, Martes, etc.)
    opening_time: string;   // Hora de apertura en formato 'HH:mm'
    closing_time: string;   // Hora de cierre en formato 'HH:mm'
    is_open: boolean;       // Si el negocio está abierto o cerrado ese día
  }
  
  export interface TenantSchedule {
    schedule: BusinessHour[]; // Lista de horarios para cada día de la semana
  }
  