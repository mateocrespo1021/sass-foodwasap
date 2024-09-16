export interface Register {
    name:       string;
    email:      string;
    password:   string;
    password_confirmation : string;
    uniqd?:      string;
    updated_at?: Date;
    created_at?: Date;
    id?:         number;
}
