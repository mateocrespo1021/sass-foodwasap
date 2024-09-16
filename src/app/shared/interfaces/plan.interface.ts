export interface Plan {
    name?:        string;
    price?:       number;
    description?: string;
    features?:    string | any;
    updated_at?:  Date;
    created_at?:  Date;
    id?:          number;
}
