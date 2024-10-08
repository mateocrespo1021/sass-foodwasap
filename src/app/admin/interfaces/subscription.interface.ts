export interface Subscription {
    id:         number;
    id_plan:    number;
    id_tenant:  number;
    start_date: Date;
    end_date:   Date;
    status:     number;
    created_at: Date;
    updated_at: Date;
}
