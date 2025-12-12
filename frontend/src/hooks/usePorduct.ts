import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  productServices,
  type Product,
  type CreateProductInput,
  type UpdateProductInput,
  type QueryParams,
} from "@/services/productServices";

// Helper function to extract error message
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error) {
    return error.message;
  }
  const axiosError = error as { response?: { data?: { message?: string } } };
  return axiosError?.response?.data?.message || defaultMessage;
};

// Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params?: QueryParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Hook: Get all products
export const useProducts = (params?: QueryParams) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productServices.getAll(params),
    select: (data) => data.data.products,
  });
};

// Hook: Get products with pagination info
export const useProductsWithPagination = (params?: QueryParams) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productServices.getAll(params),
  });
};

// Hook: Get single product by ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productServices.getById(id),
    select: (data) => data.data.product,
    enabled: !!id,
  });
};

// Hook: Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) => productServices.create(data),
    onSuccess: () => {
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success("Product created successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to create product"));
    },
  });
};

// Hook: Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) =>
      productServices.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      toast.success("Product updated successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update product"));
    },
  });
};

// Hook: Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productServices.delete(id),
    onSuccess: () => {
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success("Product deleted successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete product"));
    },
  });
};

