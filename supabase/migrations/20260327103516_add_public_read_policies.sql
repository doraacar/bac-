/*
  # Add Public Read Access Policies

  1. Security Changes
    - Add policy for public read access to categories table
    - Add policy for public read access to products table
    - These policies allow anyone to view products without authentication
    - Write operations remain restricted (no policies = no access)

  2. Rationale
    - E-commerce sites need public product visibility
    - Admin operations will be handled separately (authenticated users only)
*/

-- Policy for public read access to categories
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

-- Policy for public read access to products
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);
