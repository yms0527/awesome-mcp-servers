import { z } from "zod";

export interface TombaConfig {
    apiKey: string;
    secretKey: string;
}

export interface DomainSearchParams {
    domain?: string;
    company?: string;
    page?: number;
    limit?: "10" | "20" | "50";
    country?: string;
    department?:
        | "engineering"
        | "sales"
        | "finance"
        | "hr"
        | "it"
        | "marketing"
        | "operations"
        | "management"
        | "executive"
        | "legal"
        | "support"
        | "communication"
        | "software"
        | "security"
        | "pr"
        | "warehouse"
        | "diversity"
        | "administrative"
        | "facilities"
        | "accounting";
}

export interface EmailFinderParams {
    domain?: string;
    company?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    enrich_mobile?: boolean;
}

export interface EmailVerifierParams {
    email: string;
    enrich_mobile?: boolean;
}

export interface EmailEnrichmentParams {
    email: string;
    enrich_mobile?: boolean;
}

export interface AuthorFinderParams {
    url: string;
}

export interface LinkedinFinderParams {
    url: string;
    enrich_mobile?: boolean;
    full?: boolean;
}

export interface PhoneFinderParams {
    email?: string;
    domain?: string;
    linkedin?: string;
    full?: boolean;
}

export interface PhoneValidatorParams {
    phone: string;
}

export interface EmailCountParams {
    domain: string;
}

export interface SimilarFinderParams {
    domain: string;
}

export interface TechnologyFinderParams {
    domain: string;
}

// Zod Schemas for validation
export const TombaConfigSchema = z
    .object({
        apiKey: z
            .string()
            .min(1, "API key is required")
            .regex(
                /^ta_[a-z0-9]+$/,
                "API key must start with 'ta_' followed by lowercase alphanumeric characters",
            ),
        secretKey: z
            .string()
            .min(1, "Secret key is required")
            .regex(
                /^ts_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
                "Secret key must start with 'ts_' followed by UUID format",
            ),
    })
    .describe("Configuration schema for Tomba API authentication");
export const DomainSearchParamsSchema = z
    .object({
        domain: z
            .string()
            .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format")
            .optional()
            .describe("The domain to search for emails (e.g., 'example.com')"),
        company: z
            .string()
            .min(3, "Company name must be at least 3 characters")
            .max(75, "Company name must be at most 75 characters")
            .optional()
            .describe("The company name to search for"),
        page: z
            .number()
            .int()
            .min(1, "Page must be at least 1")
            .optional()
            .default(1)
            .describe("Page number for pagination"),
        limit: z
            .enum(["10", "20", "50"])
            .default("10")
            .optional()
            .describe("Maximum number of results to return (10, 20, or 50)"),
        country: z
            .string()
            .length(2, "Country code must be 2 characters")
            .regex(/^[A-Z]{2}$/, "Country code must be uppercase letters")
            .optional()
            .describe("Country code in ISO 3166-1 alpha-2 format (e.g., 'US')"),
        department: z
            .enum([
                "engineering",
                "sales",
                "finance",
                "hr",
                "it",
                "marketing",
                "operations",
                "management",
                "executive",
                "legal",
                "support",
                "communication",
                "software",
                "security",
                "pr",
                "warehouse",
                "diversity",
                "administrative",
                "facilities",
                "accounting",
            ])
            .optional()
            .describe("Filter results by department"),
    })
    .describe(
        "Search for email addresses associated with a domain name or company",
    );

export const EmailFinderParamsSchema = z
    .object({
        domain: z
            .string()
            .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format")
            .optional()
            .describe("The domain of the company (e.g., 'example.com')"),
        company: z
            .string()
            .min(3, "Company name must be at least 3 characters")
            .max(75, "Company name must be at most 75 characters")
            .optional()
            .describe("The company name to search in"),
        fullName: z
            .string()
            .min(1, "Full name is required")
            .optional()
            .describe(
                "The full name of the person (alternative to firstName/lastName)",
            ),
        firstName: z
            .string()
            .min(1, "First name is required")
            .max(50, "First name too long")
            .regex(/^[a-zA-Z\s-']+$/, "Invalid characters in first name")
            .optional(),
        lastName: z
            .string()
            .min(1, "Last name is required")
            .max(50, "Last name too long")
            .regex(/^[a-zA-Z\s-']+$/, "Invalid characters in last name")
            .optional(),
        enrichMobile: z
            .boolean()
            .optional()
            .describe("Whether to enrich with mobile phone data"),
    })
    .describe(
        "Find email addresses by providing a domain and person's first/last name",
    );

export const EmailVerifierParamsSchema = z
    .object({
        email: z.email("Invalid email format").min(1, "Email is required"),
        enrich_mobile: z
            .boolean()
            .optional()
            .describe("Whether to enrich with mobile phone data"),
    })
    .describe(
        "Verify email address deliverability and validity with detailed verification data",
    );

export const EmailEnrichmentParamsSchema = z
    .object({
        email: z.email("Invalid email format").min(1, "Email is required"),
        enrich_mobile: z
            .boolean()
            .optional()
            .describe("Whether to enrich with mobile phone data"),
    })
    .describe(
        "Enrich email addresses with additional data including social profiles and company information",
    );

export const AuthorFinderParamsSchema = z
    .object({
        url: z.string().min(1, "URL is required"),
    })
    .describe(
        "Find email addresses of article authors from a given webpage URL",
    );

export const LinkedinFinderParamsSchema = z
    .object({
        url: z
            .string()
            .regex(/linkedin\.com/, "Must be a LinkedIn URL")
            .min(1, "LinkedIn URL is required"),
        enrich_mobile: z
            .boolean()
            .optional()
            .describe("Whether to enrich with mobile phone data"),
    })
    .describe(
        "Find email addresses from LinkedIn profile URLs with optional phone enrichment",
    );

export const PhoneFinderParamsSchema = z
    .object({
        email: z.email("Invalid email format").optional(),
        domain: z
            .string()
            .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format")
            .describe("The domain of the company (e.g., 'example.com')")
            .optional(),
        linkedin: z
            .url("Invalid LinkedIn URL format")
            .regex(/linkedin\.com/, "Must be a LinkedIn URL")
            .optional(),
        full: z
            .boolean()
            .optional()
            .describe("Whether to return full phone details"),
    })
    .refine((data) => data.email || data.domain || data.linkedin, {
        message: "At least one of email, domain, or linkedin must be provided",
        path: ["email", "domain", "linkedin"],
    })
    .describe(
        "Find phone numbers based on email address, domain, or LinkedIn profile",
    );

export const PhoneValidatorParamsSchema = z
    .object({
        phone: z.string().min(1, "Phone number is required"),
        country: z
            .string()
            .length(2, "Country code must be 2 characters")
            .regex(/^[A-Z]{2}$/, "Country code must be uppercase letters")
            .describe("Country code in ISO 3166-1 alpha-2 format (e.g., 'US')")
            .optional(),
    })
    .describe(
        "Validate phone numbers and retrieve carrier information with optional country code",
    );

export const EmailCountParamsSchema = z
    .object({
        domain: z
            .string()
            .min(1, "Domain is required")
            .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format"),
    })
    .describe(
        "Get the total count of email addresses available for a specific domain",
    );

export const SimilarFinderParamsSchema = z
    .object({
        domain: z
            .string()
            .min(1, "Domain is required")
            .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format"),
    })
    .describe(
        "Discover similar domains and related companies based on a given domain",
    );

export const TechnologyFinderParamsSchema = z
    .object({
        domain: z
            .string()
            .min(1, "Domain is required")
            .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format"),
    })
    .describe(
        "Reveal the technology stack and tools used by any website domain",
    );

export const CompaniesSearchParamsSchema = z
    .object({
        query: z
            .string()
            .min(
                10,
                "Natural language query - AI assistant will select appropriate filters for you",
            )
            .optional(),
        filters: z
            .object({
                location_city: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                location_state: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                location_country: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                industry: z
                    .object({
                        include: z
                            .array(
                                z.enum([
                                    // Technology & Software
                                    "Computer Software",
                                    "Information Technology and Services",
                                    "Internet",
                                    "Computer Hardware",
                                    "Computer Networking",
                                    "Computer & Network Security",
                                    "Semiconductors",
                                    "Telecommunications",
                                    "Wireless",
                                    // Business Services
                                    "Management Consulting",
                                    "Human Resources",
                                    "Staffing and Recruiting",
                                    "Professional Training & Coaching",
                                    "Business Supplies and Equipment",
                                    "Outsourcing/Offshoring",
                                    // Financial Services
                                    "Financial Services",
                                    "Banking",
                                    "Investment Banking",
                                    "Investment Management",
                                    "Venture Capital & Private Equity",
                                    "Insurance",
                                    "Accounting",
                                    // Healthcare & Life Sciences
                                    "Hospital & Health Care",
                                    "Medical Devices",
                                    "Pharmaceuticals",
                                    "Biotechnology",
                                    "Health, Wellness and Fitness",
                                    "Mental Health Care",
                                    "Veterinary",
                                    // Manufacturing & Industrial
                                    "Automotive",
                                    "Aviation & Aerospace",
                                    "Chemicals",
                                    "Civil Engineering",
                                    "Construction",
                                    "Electrical/Electronic Manufacturing",
                                    "Industrial Automation",
                                    "Machinery",
                                    "Manufacturing",
                                    "Mechanical or Industrial Engineering",
                                    "Mining & Metals",
                                    "Oil & Energy",
                                    "Plastics",
                                    "Renewables & Environment",
                                    "Utilities",
                                    // Retail & Consumer Goods
                                    "Retail",
                                    "Consumer Electronics",
                                    "Consumer Goods",
                                    "Consumer Services",
                                    "Cosmetics",
                                    "Food & Beverages",
                                    "Food Production",
                                    "Luxury Goods & Jewelry",
                                    "Sporting Goods",
                                    "Supermarkets",
                                    "Wine and Spirits",
                                    // Media & Entertainment
                                    "Broadcast Media",
                                    "Entertainment",
                                    "Media Production",
                                    "Motion Pictures and Film",
                                    "Music",
                                    "Newspapers",
                                    "Online Media",
                                    "Publishing",
                                    "Animation",
                                    "Computer Games",
                                    "Gambling & Casinos",
                                    // Marketing & Advertising
                                    "Marketing and Advertising",
                                    "Market Research",
                                    "Public Relations and Communications",
                                    "Events Services",
                                    "Graphic Design",
                                    // Education
                                    "Education Management",
                                    "E-Learning",
                                    "Higher Education",
                                    "Primary/Secondary Education",
                                    "Research",
                                    // Legal & Government
                                    "Law Practice",
                                    "Legal Services",
                                    "Government Administration",
                                    "Government Relations",
                                    "Judiciary",
                                    "Legislative Office",
                                    "Military",
                                    "Public Policy",
                                    "Public Safety",
                                    // Real Estate & Property
                                    "Real Estate",
                                    "Commercial Real Estate",
                                    "Property Management",
                                    // Transportation & Logistics
                                    "Airlines/Aviation",
                                    "Logistics and Supply Chain",
                                    "Maritime",
                                    "Package/Freight Delivery",
                                    "Railroad Manufacture",
                                    "Shipbuilding",
                                    "Transportation/Trucking/Railroad",
                                    "Warehousing",
                                    // Hospitality & Travel
                                    "Hospitality",
                                    "Hotels",
                                    "Restaurants",
                                    "Food & Beverages",
                                    "Leisure, Travel & Tourism",
                                    "Recreational Facilities and Services",
                                    // Non-Profit & Social
                                    "Nonprofit Organization Management",
                                    "Philanthropy",
                                    "Religious Institutions",
                                    "Think Tanks",
                                    "Civic & Social Organization",
                                    "Political Organization",
                                    // Other Industries
                                    "Agriculture",
                                    "Apparel & Fashion",
                                    "Architecture & Planning",
                                    "Arts and Crafts",
                                    "Building Materials",
                                    "Design",
                                    "Environmental Services",
                                    "Facilities Services",
                                    "Fine Art",
                                    "Fishery",
                                    "Furniture",
                                    "Glass, Ceramics & Concrete",
                                    "Import and Export",
                                    "Individual & Family Services",
                                    "International Affairs",
                                    "International Trade and Development",
                                    "Law Enforcement",
                                    "Libraries",
                                    "Nanotechnology",
                                    "Museums and Institutions",
                                    "Packaging and Containers",
                                    "Paper & Forest Products",
                                    "Performing Arts",
                                    "Photography",
                                    "Printing",
                                    "Program Development",
                                    "Ranching",
                                    "Security and Investigations",
                                    "Sports",
                                    "Textiles",
                                    "Tobacco",
                                    "Translation and Localization",
                                    "Writing and Editing",
                                    "Wholesale",
                                ]),
                            )
                            .optional()
                            .describe(
                                "Industries to include. Based on LinkedIn Industry Codes V2. Use keywords filter if industry not listed.",
                            ),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional()
                    .describe(
                        "Filter by industry (based on LinkedIn Industry Codes V2). If your target industry is not listed, use the 'keywords' filter instead for more flexible matching.",
                    ),
                type: z
                    .object({
                        include: z
                            .array(
                                z.enum([
                                    "education", // School, college, or university
                                    "government", // Government agency or department
                                    "nonprofit", // Non-profit organization
                                    "private", // Privately owned, not publicly traded
                                    "public", // Publicly traded on a stock exchange
                                    "personal", // Individual's personal website
                                ]),
                            )
                            .optional()
                            .describe(
                                "Company types to include: education, government, nonprofit, private, public, personal",
                            ),
                        exclude: z
                            .array(
                                z.enum([
                                    "education",
                                    "government",
                                    "nonprofit",
                                    "private",
                                    "public",
                                    "personal",
                                ]),
                            )
                            .optional()
                            .describe("Company types to exclude"),
                    })
                    .optional()
                    .describe(
                        "Filter by company type. Available types: education (school/college/university), government (agency/department), nonprofit (non-profit organization), private (privately owned), public (publicly traded), personal (individual's website)",
                    ),
                size: z
                    .object({
                        include: z
                            .array(
                                z.enum([
                                    "1-10", // Micro-sized team
                                    "11-50", // Small-sized business
                                    "51-250", // Mid-sized company
                                    "251-1K", // Medium-large business
                                    "1K-5K", // Large company
                                    "5K-10K", // Very large company
                                    "10K-50K", // Enterprise-scale company
                                    "50K-100K", // Massive corporation
                                    "100K+", // Global enterprise
                                ]),
                            )
                            .optional()
                            .describe(
                                "Company sizes to include: 1-10 (Micro), 11-50 (Small), 51-250 (Mid-sized), 251-1K (Medium-large), 1K-5K (Large), 5K-10K (Very large), 10K-50K (Enterprise), 50K-100K (Massive), 100K+ (Global)",
                            ),
                        exclude: z
                            .array(
                                z.enum([
                                    "1-10",
                                    "11-50",
                                    "51-250",
                                    "251-1K",
                                    "1K-5K",
                                    "5K-10K",
                                    "10K-50K",
                                    "50K-100K",
                                    "100K+",
                                ]),
                            )
                            .optional()
                            .describe("Company sizes to exclude"),
                    })
                    .optional()
                    .describe(
                        "Filter by company size range. Available ranges: 1-10 (Micro-sized team), 11-50 (Small-sized business), 51-250 (Mid-sized company), 251-1K (Medium-large business), 1K-5K (Large company), 5K-10K (Very large company), 10K-50K (Enterprise-scale company), 50K-100K (Massive corporation), 100K+ (Global enterprise)",
                    ),
                revenue: z
                    .object({
                        include: z
                            .array(
                                z.enum([
                                    "$0-$1M", // Startup or very small business revenue
                                    "$1M-$10M", // Small business revenue range
                                    "$10M-$50M", // Mid-sized business revenue range
                                    "$50M-$100M", // Large business revenue range
                                    "$100M-$250M", // Very large business revenue range
                                    "$250M-$500M", // Enterprise-level revenue range
                                    "$500M-$1B", // Major corporation revenue range
                                    "$1B-$10B", // Large corporation revenue range
                                    "$10B+", // Global enterprise revenue range
                                ]),
                            )
                            .optional()
                            .describe(
                                "Revenue ranges to include: $0-$1M (Startup), $1M-$10M (Small), $10M-$50M (Mid-sized), $50M-$100M (Large), $100M-$250M (Very large), $250M-$500M (Enterprise), $500M-$1B (Major corp), $1B-$10B (Large corp), $10B+ (Global)",
                            ),
                        exclude: z
                            .array(
                                z.enum([
                                    "$0-$1M",
                                    "$1M-$10M",
                                    "$10M-$50M",
                                    "$50M-$100M",
                                    "$100M-$250M",
                                    "$250M-$500M",
                                    "$500M-$1B",
                                    "$1B-$10B",
                                    "$10B+",
                                ]),
                            )
                            .optional()
                            .describe("Revenue ranges to exclude"),
                    })
                    .optional()
                    .describe(
                        "Filter by annual revenue range. Available ranges: $0-$1M (Startup/very small), $1M-$10M (Small business), $10M-$50M (Mid-sized), $50M-$100M (Large), $100M-$250M (Very large), $250M-$500M (Enterprise), $500M-$1B (Major corporation), $1B-$10B (Large corporation), $10B+ (Global enterprise)",
                    ),
                sic: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                naics: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                keywords: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                founded: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                similar: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
            })
            .optional(),
        page: z
            .number()
            .int()
            .min(1, "Page must be at least 1")
            .optional()
            .default(1),
    })
    .describe(
        "Search for companies using natural language queries or detailed filters including location, industry, size, revenue, and more",
    );

// Additional validation schemas for common patterns
export const PaginationSchema = z.object({
    page: z.number().int().min(1).default(1),
});

export const CountryCodeSchema = z
    .string()
    .length(2)
    .regex(/^[A-Z]{2}$/)
    .optional();

export const DomainSchema = z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

export const EmailSchema = z.email();

export const URLSchema = z.url();

export const LinkedInURLSchema = z.url().regex(/linkedin\.com/);

export const PhoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);

// Utility type for validated parameters
export type ValidatedParams<T> = T extends z.ZodSchema<infer U> ? U : never;
