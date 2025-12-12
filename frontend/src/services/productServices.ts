import clientAxios from "@/lib/clientAxios";

// Types
export interface Product {
  _id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  rating: number;
  numReviews: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  isDiscounted?: boolean;
}

export interface CreateProductInput {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  image?: File | string;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductsResponse {
  status: string;
  results: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  data: {
    products: Product[];
  };
}

export interface ProductResponse {
  status: string;
  data: {
    product: Product;
  };
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  search?: string;
  [key: string]: string | number | undefined;
}

// Services
export const productServices = {
  // Get all products with pagination, filtering, and search
  getAll: async (params?: QueryParams): Promise<ProductsResponse> => {
    const response = await clientAxios.get<ProductsResponse>("/products", {
      params,
    });
    return response.data;
  },

  // Get single product by ID
  getById: async (id: string): Promise<ProductResponse> => {
    const response = await clientAxios.get<ProductResponse>(
      `/products/${id}`
    );
    return response.data;
  },

  // Create a new product
  create: async (data: CreateProductInput | FormData): Promise<ProductResponse> => {
    const response = await clientAxios.post<ProductResponse>(
      "/products",
      data
    );
    return response.data;
  },

  // Update a product
  update: async (
    id: string,
    data: UpdateProductInput | FormData
  ): Promise<ProductResponse> => {
    const response = await clientAxios.patch<ProductResponse>(
      `/products/${id}`,
      data
    );
    return response.data;
  },

  // Delete a product (soft delete)
  delete: async (id: string): Promise<void> => {
    await clientAxios.delete(`/products/${id}`);
  },
};

