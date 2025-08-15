-- Create users and roles tables
-- This script sets up the user management system with roles and permissions

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create roles enum
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'operator', 'viewer');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'operator',
    status user_status DEFAULT 'active',
    phone VARCHAR(20),
    avatar_url TEXT,
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id)
);

-- Create permissions table
CREATE TABLE public.permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL, -- inventory, goods_receipt, goods_issue, transfer, users, reports
    action VARCHAR(50) NOT NULL, -- create, read, update, delete, approve
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create role_permissions junction table
CREATE TABLE public.role_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role user_role NOT NULL,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role, permission_id)
);

-- Create indexes
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_permissions_module ON public.permissions(module);
CREATE INDEX idx_role_permissions_role ON public.role_permissions(role);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins and managers can update users" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- Insert default permissions
INSERT INTO public.permissions (name, description, module, action) VALUES
-- Inventory permissions
('inventory.create', 'Create inventory items', 'inventory', 'create'),
('inventory.read', 'View inventory items', 'inventory', 'read'),
('inventory.update', 'Update inventory items', 'inventory', 'update'),
('inventory.delete', 'Delete inventory items', 'inventory', 'delete'),
('inventory.adjust', 'Adjust inventory levels', 'inventory', 'adjust'),

-- Goods Receipt permissions
('goods_receipt.create', 'Create goods receipts', 'goods_receipt', 'create'),
('goods_receipt.read', 'View goods receipts', 'goods_receipt', 'read'),
('goods_receipt.update', 'Update goods receipts', 'goods_receipt', 'update'),
('goods_receipt.delete', 'Delete goods receipts', 'goods_receipt', 'delete'),
('goods_receipt.approve', 'Approve goods receipts', 'goods_receipt', 'approve'),

-- Goods Issue permissions
('goods_issue.create', 'Create goods issues', 'goods_issue', 'create'),
('goods_issue.read', 'View goods issues', 'goods_issue', 'read'),
('goods_issue.update', 'Update goods issues', 'goods_issue', 'update'),
('goods_issue.delete', 'Delete goods issues', 'goods_issue', 'delete'),
('goods_issue.approve', 'Approve goods issues', 'goods_issue', 'approve'),

-- Transfer permissions
('transfer.create', 'Create transfer orders', 'transfer', 'create'),
('transfer.read', 'View transfer orders', 'transfer', 'read'),
('transfer.update', 'Update transfer orders', 'transfer', 'update'),
('transfer.delete', 'Delete transfer orders', 'transfer', 'delete'),
('transfer.approve', 'Approve transfer orders', 'transfer', 'approve'),

-- User management permissions
('users.create', 'Create users', 'users', 'create'),
('users.read', 'View users', 'users', 'read'),
('users.update', 'Update users', 'users', 'update'),
('users.delete', 'Delete users', 'users', 'delete'),

-- Reports permissions
('reports.view', 'View reports', 'reports', 'read'),
('reports.export', 'Export reports', 'reports', 'export');

-- Insert default role permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin', id FROM public.permissions; -- Admin has all permissions

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'manager', id FROM public.permissions 
WHERE module IN ('inventory', 'goods_receipt', 'goods_issue', 'transfer', 'reports');

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'operator', id FROM public.permissions 
WHERE action IN ('create', 'read', 'update') AND module IN ('inventory', 'goods_receipt', 'goods_issue', 'transfer');

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'viewer', id FROM public.permissions 
WHERE action = 'read';
