// src/app/models/order.model.ts
export interface Order {
    id?: number; // Opcional porque será autogenerado por la base de datos
    direction: string;
    id_tenant?:number;
    business_name?: string;
    tel: string;
    pay: string;
    delivery: string;
    name_client: string;
    note?: string; // Opcional porque puede ser nulo
    price_total: number;
    cart: any; // Ajusta el tipo según tu estructura real
    status: number;
    created_at?: Date; // Opcional porque será autogenerado por la base de datos
    updated_at?: Date; // Opcional porque será autogenerado por la base de datos
  }
  