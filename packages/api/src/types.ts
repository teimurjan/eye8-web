export interface APIClient {
  get: <T>(...args: any[]) => Promise<{ data: T }>;
  post: <T>(...args: any[]) => Promise<{ data: T }>;
  put: <T>(...args: any[]) => Promise<{ data: T }>;
  patch: <T>(...args: any[]) => Promise<{ data: T }>;
  delete: <T>(...args: any[]) => Promise<{ data: T }>;
  head: <T>(...args: any[]) => Promise<{ data: T }>;
}

export interface PaginationMeta {
  count: number;
  pages_count: number;
  limit: number;
  page: number;
}

export interface Product {
  id: number;
  discount: number;
  price: number;
  quantity: number;
  product_type: { category: number; feature_types: number[]; id: number; name: string; slug: string; image: string };
  feature_values: Array<{
    feature_type: { id: number; name: string };
    id: number;
    name: string;
  }>;
  images: string[];
  created_on: string;
  updated_on: string;
}

export interface Banner<
  Raw extends boolean = false,
  T = Raw extends true
    ? {
        [key: string]: string;
      }
    : string
> {
  id: number;
  text: T;
  link_text: T;
  link: string | null;
  text_color: string | null;
  image: string;
  text_top_offset: number | null;
  text_left_offset: number | null;
  text_right_offset: number | null;
  text_bottom_offset: number | null;
  created_on: string;
  updated_on: string;
}

export interface Category<
  Raw extends boolean = false,
  T = Raw extends true
    ? {
        [key: string]: string;
      }
    : string
> {
  id: number;
  name: T;
  parent_category_id: number | null;
  slug: string;
  created_on: string;
  updated_on: string;
}

export interface CharacteristicValue<
  Raw extends boolean = false,
  T = Raw extends true
    ? {
        [key: string]: string;
      }
    : string
> {
  id: number;
  name: T;
  characteristic: Characteristic<Raw>;
  created_on: string;
  updated_on: string;
}

export interface Characteristic<
  Raw extends boolean = false,
  T = Raw extends true
    ? {
        [key: string]: string;
      }
    : string
> {
  id: number;
  name: T;
  created_on: string;
  updated_on: string;
}

export interface FeatureType<
  Raw extends boolean = false,
  T = Raw extends true
    ? {
        [key: string]: string;
      }
    : string
> {
  id: number;
  name: T;
  created_on: string;
  updated_on: string;
}

export interface FeatureValue<
  Raw extends boolean = false,
  T = Raw extends true
    ? {
        [key: string]: string;
      }
    : string
> {
  id: number;
  name: T;
  feature_type: FeatureType<Raw>;
  created_on: string;
  updated_on: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  product_price_per_item: number;
  product_discount: number;
  product?: {
    id: number;
    quantity: number;
    product_type: {
      id: number;
      name: string;
      slug: string;
    };
  };
}

export interface Order {
  id: number;
  user_name: string;
  user_phone_number: string;
  user_address: string;
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
  items: OrderItem[];
  status: 'idle' | 'completed' | 'approved' | 'rejected';
  promo_code_value?: string;
  promo_code_products?: number[];
  promo_code_discount?: number;
  promo_code_amount?: number;
}

export interface ProductType<
  Raw extends boolean = false,
  T = Raw extends true
    ? {
        [key: string]: string;
      }
    : string
> {
  id: number;
  name: T;
  description: T;
  short_description: T;
  instagram_links: Array<{ id: number; link: string }>;
  image: string;
  categories: Array<{ id: number; name: T; slug: string }>;
  slug: string;
  feature_types: Array<{ id: number; name: T; slug: string }>;
  characteristic_values: Array<{ id: number; name: T }>;
  products?: Array<{
    discount: number;
    feature_values: number[];
    id: number;
    price: number;
    quantity: number;
  }>;
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
}

export type TinyProductType<Raw extends boolean = false> = Pick<ProductType<Raw>, 'id' | 'name' | 'feature_types'>;

export interface PromoCode {
  id: number;
  discount: number;
  amount?: number;
  value: string;
  is_active: boolean;
  disable_on_use: boolean;
  products?: number[];
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
}

export interface Rate {
  id: number;
  name: string;
  value: number;
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
}
