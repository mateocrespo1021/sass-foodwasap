export interface Tenant {
    id?:             number;
    tel:            string | undefined;
    terms_accepted: number | undefined;
    business_name:  string | undefined;
    country:        string | undefined;
    id_plan?:        number;
    id_user?:        number;
    created_at?:     Date;
    updated_at?:     Date;
}
