/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  categoryId: string;
  categoryName?: string;
  productType: string; // "Ultra Thin" | "XL" | "Overnight" | "Panty Liner" | "Maternity"
  amazonLink: string;
  flipkartLink: string;
  features: string[];
  sizes: string[]; // e.g. ["Regular (240mm)", "XL (280mm)", "XXL (320mm)"]
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  status: 'Active' | 'Draft';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export type InquiryStatus = 'New Inquiry' | 'Contacted' | 'In Discussion' | 'Completed';

export interface BulkInquiry {
  id: string;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  productId: string;
  productName: string;
  quantity: number;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export type ReviewStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Review {
  id: string;
  customerName: string;
  productId: string;
  productName: string;
  rating: number; // 1 to 5
  reviewMessage: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalInquiries: number;
  totalReviews: number;
  pendingReviews: number;
  recentInquiries: BulkInquiry[];
  monthlyInquiryStats: { month: string; inquiries: number }[];
  categoryDistribution: { name: string; value: number }[];
}

export interface RecentActivity {
  id: string;
  type: 'inquiry_created' | 'review_submitted' | 'review_approved' | 'review_rejected' | 'product_created' | 'product_updated';
  message: string;
  time: string;
}
