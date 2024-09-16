export interface Product {
    id:          number;
    name:        string;
    description: string;
    price:       number;
    discount:    number;
    iva:         number;
    id_category: number;
    created_at:  Date;
    updated_at:  Date;
    image:       string;
    status:      number;
}
