-- 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. tenants
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    custom_domain VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. tenant_branding
CREATE TABLE public.tenant_branding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    logo_url VARCHAR(1024),
    primary_color VARCHAR(50),
    accent_color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id)
);

-- 3. users_profile (Connecting Auth users to a tenant and managing roles)
CREATE TABLE public.users_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'customer',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. staff
CREATE TABLE public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_profile_id UUID REFERENCES public.users_profile(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    image VARCHAR(1024),
    is_owner BOOLEAN DEFAULT false,
    phone VARCHAR(50),
    calendar_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. services
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_tr VARCHAR(255),
    duration INTEGER NOT NULL,
    price INTEGER NOT NULL,
    image VARCHAR(1024),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. customers
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_profile_id UUID REFERENCES public.users_profile(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. appointments
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    synced_to_google BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. campaigns
CREATE TABLE public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. reminders
CREATE TABLE public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. whatsapp_logs
CREATE TABLE public.whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    to_number VARCHAR(50),
    message TEXT,
    status VARCHAR(50),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. calendar_integrations
CREATE TABLE public.calendar_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
    provider VARCHAR(50) DEFAULT 'google',
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. ai_recommendations
CREATE TABLE public.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    context TEXT,
    recommendation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. customer_segments
CREATE TABLE public.customer_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255),
    criteria JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. subscriptions
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    plan_id VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. payments
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    currency VARCHAR(10) DEFAULT 'TRY',
    status VARCHAR(50) DEFAULT 'pending',
    provider_reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. audit_logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(255),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_staff_tenant ON public.staff(tenant_id);
CREATE INDEX idx_services_tenant ON public.services(tenant_id);
CREATE INDEX idx_customers_tenant ON public.customers(tenant_id);
CREATE INDEX idx_appointments_tenant ON public.appointments(tenant_id);
CREATE INDEX idx_appointments_date ON public.appointments(tenant_id, appointment_date);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(tenant_id, status);

-- ROW LEVEL SECURITY (RLS) PREPARATION

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Scaffold policies for 'appointments' as an example:

-- Super admin (can access all)
-- Assuming a function is_super_admin(uid) exists, or a claim in JWT.
-- CREATE POLICY "Super admins can access all appointments" ON appointments FOR ALL USING (is_super_admin(auth.uid()));

-- Salon Owner (can access their tenant's data)
CREATE POLICY "Salon owners can access their tenant appointments" ON appointments
    FOR ALL
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.users_profile
            WHERE id = auth.uid() AND role = 'salon_owner'
        )
    );

-- Staff (can access their tenant's data, maybe restricted to own appointments later)
CREATE POLICY "Staff can access their tenant appointments" ON appointments
    FOR ALL
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.users_profile
            WHERE id = auth.uid() AND role = 'staff'
        )
    );

-- Customers (can access their own appointments)
CREATE POLICY "Customers can view own appointments" ON appointments
    FOR SELECT
    USING (
        customer_id IN (
            SELECT id FROM public.customers
            WHERE user_profile_id = auth.uid()
        )
    );
