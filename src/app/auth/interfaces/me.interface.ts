import { SocialNetworks, TenantSchedule } from "../../admin/interfaces/tenant.interface";


export interface Me {
    user: UserMe;
}

export interface UserMe {
    id:         number;
    name:       string;
    email:      string;
    admin:number;
    created_at: Date;
    updated_at: Date;
    tenant:     TenantMe;
}

export interface TenantMe {
    id:             number;
    tel:            string;
    terms_accepted: number;
    business_name:  string;
    country:        string;
    id_user:        number;
    created_at:     null;
    updated_at:     null;
    social_networks?: SocialNetworks;
    logo?: string;
    address?:string;
    schedule? : TenantSchedule;
}
