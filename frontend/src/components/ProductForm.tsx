import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  type CreateProductInput,
  type UpdateProductInput,
} from "@/services/productServices";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(100, "Product name cannot exceed 100 characters"),
  nameEn: z.string().min(2, "Product name (English) must be at least 2 characters").max(100, "Product name (English) cannot exceed 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  descriptionEn: z.string().min(10, "Description (English) must be at least 10 characters"),
  price: z.number().min(0, "Price must be a positive number"),
  originalPrice: z.union([z.number().min(0, "Original price must be a positive number"), z.literal("")]).optional(),
  stock: z.number().int("Stock must be an integer").min(0, "Stock cannot be negative").optional(),
  image: z.instanceof(File, { message: "Image file is required" }),
});

const updateProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(100, "Product name cannot exceed 100 characters").optional(),
  nameEn: z.string().min(2, "Product name (English) must be at least 2 characters").max(100, "Product name (English) cannot exceed 100 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  descriptionEn: z.string().min(10, "Description (English) must be at least 10 characters").optional(),
  price: z.number().min(0, "Price must be a positive number").optional(),
  originalPrice: z.union([z.number().min(0, "Original price must be a positive number"), z.literal("")]).optional(),
  stock: z.number().int("Stock must be an integer").min(0, "Stock cannot be negative").optional(),
  image: z.instanceof(File, { message: "Image file is required" }).optional().or(z.literal("")),
});

type ProductFormValues = z.infer<typeof createProductSchema> | z.infer<typeof updateProductSchema>;

interface ProductFormProps {
  product?: {
    _id: string;
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    price: number;
    originalPrice?: number;
    stock: number;
    image: string;
  };
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProductForm = ({ product, onSubmit, onCancel, isLoading }: ProductFormProps) => {
  const schema = product ? updateProductSchema : createProductSchema;
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name || "",
      nameEn: product?.nameEn || "",
      description: product?.description || "",
      descriptionEn: product?.descriptionEn || "",
      price: product?.price || 0,
      originalPrice: product?.originalPrice || "",
      stock: product?.stock || 0,
      image: "",
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection and preview
  const handleFileChange = (file: File | null) => {
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(product?.image || null);
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(product?.image || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    form.setValue("image", "");
  };

  const handleSubmit = (data: ProductFormValues) => {
    // Create FormData for file upload
    const formData = new FormData();
    
    if (data.name) formData.append("name", data.name);
    if (data.nameEn) formData.append("nameEn", data.nameEn);
    if (data.description) formData.append("description", data.description);
    if (data.descriptionEn) formData.append("descriptionEn", data.descriptionEn);
    if (data.price !== undefined) formData.append("price", data.price.toString());
    
    if (data.originalPrice !== undefined && data.originalPrice !== "" && typeof data.originalPrice === "number") {
      formData.append("originalPrice", data.originalPrice.toString());
    }
    
    if (data.stock !== undefined) {
      formData.append("stock", data.stock.toString());
    }
    
    // Use selectedFile if available, otherwise use form data
    if (selectedFile) {
      formData.append("image", selectedFile);
    } else if (data.image && data.image instanceof File) {
      formData.append("image", data.image);
    }

    // Pass FormData to onSubmit
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name (Arabic)</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name in Arabic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nameEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name (English)</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name in English" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Arabic)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description in Arabic"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descriptionEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (English)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description in English"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Price (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    value={field.value === "" ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? "" : parseFloat(value) || 0);
                    }}
                  />
                </FormControl>
                <FormDescription>Leave empty if no discount</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, onBlur, name, disabled } }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  {/* Upload Button */}
                  <label
                    htmlFor="image-upload"
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer",
                      "hover:bg-accent hover:border-primary transition-colors",
                      "border-primary/30 text-primary"
                    )}
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">تحميل صورة جديدة</span>
                    <Input
                      id="image-upload"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      name={name}
                      disabled={disabled}
                      onBlur={onBlur}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                          handleFileChange(file);
                        }
                      }}
                    />
                  </label>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                {product ? "Upload a new image to replace the current one (optional)" : "Upload product image (required)"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;

