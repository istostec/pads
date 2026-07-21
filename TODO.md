# Product Management - Replace Category Dropdown with Text Input

## Revised Plan (No schema changes)

### Goal
Replace the "Category Link" `<select>` dropdown with a text `<input>` in the Product form, while keeping the database normalized. Categories are resolved/auto-created on the backend.

### Steps

#### Step 1: Update `admin/Products.tsx` (Frontend)
- [x] Replace `catId` (number) state with `categoryName` (string) state, default `''`
- [x] Replace `<select>` dropdown for "Category Link" with `<input type="text">` with `required`
- [x] Update `handleOpenCreate()` — set `categoryName` to `''`
- [x] Update `handleOpenEdit(prod)` — populate `categoryName` from `prod.category_name`
- [x] Update `handleFormSubmit()` — send `category_name` (string) instead of `category_id` (number) in payload
- [x] Remove `categories` dependency from the form (keep it only for the table filter dropdown)

#### Step 2: Update `backend/routes/products.py` (Backend)
- [x] Added imports: `sqlalchemy.func`, `datetime.datetime`, `re`
- [x] In `create_product()`: accept `category_name` (string), resolve by case-insensitive lookup, auto-create if not found, set `category_id`
- [x] In `update_product()`: same resolve-or-create-and-set logic for `category_id`

#### Step 3: No changes needed
- [x] `backend/models/product.py` — No schema change
- [x] `backend/database/schema.sql` — No schema change
- [x] `backend/models/category.py` — No change
- [x] `backend/database/migrations/` — No migration needed
- [x] `admin/App.tsx` — No change (categories prop still used for table filter)

#### Step 4: Testing
- [ ] Test creating a product with a new category name (auto-created)
- [ ] Test creating a product with an existing category name (resolved by ID)
- [ ] Test editing a product — verify saved category name appears in input
- [ ] Test listing — categories dropdown filter still works

