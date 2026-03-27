/*
  # E-Commerce Database Schema for BACI ORGANİK ÜRÜNLER

  ## Summary
  Creates the database structure for an organic food e-commerce platform with Turkish product content.

  ## New Tables
  
  ### `categories`
  - `id` (uuid, primary key) - Unique category identifier
  - `name_tr` (text, not null) - Turkish category name
  - `slug` (text, unique, not null) - URL-friendly category identifier
  - `display_order` (integer, default 0) - Order for display sorting
  - `created_at` (timestamptz) - Creation timestamp
  
  ### `products`
  - `id` (uuid, primary key) - Unique product identifier
  - `category_id` (uuid, foreign key) - Reference to category
  - `name_tr` (text, not null) - Turkish product name
  - `description_tr` (text, default '') - Turkish product description
  - `price` (decimal, not null) - Product price in TL
  - `unit` (text, default 'adet') - Unit of measurement (adet, kg, etc.)
  - `image_url` (text, default '') - Product image URL
  - `in_stock` (boolean, default true) - Stock availability
  - `featured` (boolean, default false) - Featured product flag
  - `display_order` (integer, default 0) - Display order within category
  - `created_at` (timestamptz) - Creation timestamp
  
  ## Security
  - Enable RLS on all tables
  - Allow public read access for products and categories (e-commerce site)
  - No insert/update/delete from client (admin would be separate)

  ## Notes
  - Prices stored in Turkish Lira (TL)
  - All content fields in Turkish (_tr suffix)
  - Public read access since this is a catalog for customers
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_tr text NOT NULL,
  slug text UNIQUE NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name_tr text NOT NULL,
  description_tr text DEFAULT '',
  price decimal(10, 2) NOT NULL CHECK (price >= 0),
  unit text DEFAULT 'adet',
  image_url text DEFAULT '',
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (e-commerce catalog)
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can view products"
  ON products FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);