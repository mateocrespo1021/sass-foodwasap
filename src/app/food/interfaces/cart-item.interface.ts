import { Additional } from '../../admin/interfaces/additional.interface';
import { Product } from '../../admin/interfaces/product.interface';
import { Variant } from '../../admin/interfaces/variant.interface';

export interface CartItem {
  id: string;
  product: Product;
  variant: Variant;
  additionals: Additional[];
  amount:number;
  totalCv: number;
  totalAd : number;
}
