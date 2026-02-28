// ── Rich detail data for pack detail pages ──
// Keyed by pack slug. Packs not in this object will show a generic detail view.

export const PACK_DETAILS = {
  'auth-pack': {
    runtime: 'Python',
    license: 'MIT',
    updated: '2 days ago',
    tags: ['auth', 'jwt', 'oauth', 'rbac', 'security', 'session'],
    scopes: ['db.read', 'db.write', 'secrets.read', 'network.outbound'],
    actions: ['login', 'signup', 'verify_token', 'refresh_token', 'reset_password', 'assign_role', 'check_permission'],
    compatible: [
      { name: 'Dashboard UI', slug: 'dashboard-ui' },
      { name: 'Payments Pack', slug: 'payments-pack' },
      { name: 'Postgres Connector', slug: 'postgres-connector' },
    ],
    overview: {
      about: 'Auth Pack provides a complete, production-ready authentication and authorization system for any Logic Packs workspace. It handles user registration, login, JWT token management, OAuth provider integration, role-based access control, and session management — all with self-healing capabilities built in.',
      features: [
        'JWT authentication with automatic token rotation and refresh',
        'OAuth 2.0 integration (Google, GitHub, Apple, Microsoft)',
        'Role-based access control with granular permissions',
        'Session management with multi-device support',
        'Password hashing (bcrypt/argon2) with salt rotation',
        'Self-healing: monitors token refresh failures and auto-patches',
      ],
      quickStart: {
        lang: 'python',
        code: `from packs import AuthPack
from fastapi import FastAPI

app = FastAPI()
auth = AuthPack.install(app)

# Protected route
@app.get("/profile")
async def get_profile(user=Depends(auth.require)):
    return {"id": user.id, "role": user.role}

# Admin-only route
@app.get("/admin")
async def admin_panel(user=Depends(auth.require_role("admin"))):
    return {"message": "Welcome, admin"}`,
      },
      selfHealing: {
        desc: 'Auth Pack monitors token refresh failures, expired session patterns, and OAuth callback errors. When issues are detected, the self-healing agent proposes patches, reruns the full test suite, and ships a fix automatically.',
        steps: [
          { type: 'fail', text: 'test_token_refresh_expired → FAILED' },
          { type: 'warn', text: 'agent: analyzing refresh_token edge case' },
          { type: 'warn', text: 'agent: patch → handle clock skew in expiry check' },
          { type: 'pass', text: 'all 47 tests passing → v3.2.0 released' },
        ],
      },
    },
    contracts: `# pack.manifest.yaml
name: auth-pack
version: 3.2.0
type: logic
runtime: python >= 3.10
framework: fastapi

contracts:
  actions:
    - login
      input:  { email: string, password: string }
      output: { token: JWT, refresh: JWT, user: User }
    - signup
      input:  { email: string, password: string, name?: string }
      output: { user: User, verification_sent: bool }
    - verify_token
      input:  { token: JWT }
      output: { valid: bool, user_id: string, role: string }
    - refresh_token
      input:  { refresh: JWT }
      output: { token: JWT, refresh: JWT }
    - reset_password
      input:  { email: string }
      output: { sent: bool }
    - assign_role
      input:  { user_id: string, role: string }
      output: { updated: bool }

  scopes:
    - db.read       # Read user records
    - db.write      # Write user records
    - secrets.read  # JWT signing keys
    - network.outbound  # OAuth callbacks

tests:
  runner: pytest
  count: 47
  coverage: 94%

telemetry:
  metrics:
    - auth.login.latency_ms
    - auth.token.refresh_failures
    - auth.signup.rate

self_healing:
  enabled: true
  triggers:
    - test_failure
    - telemetry_anomaly`,
    deps: [
      { name: 'fastapi', version: '>=0.104', type: 'pip', required: true },
      { name: 'python-jose', version: '>=3.3', type: 'pip', required: true },
      { name: 'passlib', version: '>=1.7', type: 'pip', required: true },
      { name: 'bcrypt', version: '>=4.0', type: 'pip', required: true },
      { name: 'httpx', version: '>=0.25', type: 'pip', required: true },
      { name: 'postgres-connector', version: '>=2.0', type: 'pack', required: true },
      { name: 'email-service', version: '>=1.5', type: 'pack', required: false },
    ],
    changelog: [
      { ver: '3.2.0', date: 'Feb 16, 2026', title: 'Clock skew handling', desc: 'Self-healing patch: improved token expiry validation to handle up to 30s of clock skew between services.', type: 'patch' },
      { ver: '3.1.0', date: 'Feb 10, 2026', title: 'Apple Sign-In support', desc: 'Added Apple as an OAuth provider. Includes Sign in with Apple button component for UI Pack binding.', type: 'feature' },
      { ver: '3.0.0', date: 'Jan 28, 2026', title: 'RBAC overhaul', desc: 'Breaking: Roles are now hierarchical. New assign_role and check_permission actions. Migration guide included.', type: 'breaking' },
      { ver: '2.9.1', date: 'Jan 15, 2026', title: 'Session cleanup', desc: 'Automated cleanup of expired sessions. Reduced DB storage by ~40% for high-traffic instances.', type: 'improvement' },
    ],
    related: ['payments-pack', 'dashboard-ui', 'postgres-connector', 'social-auth'],
  },

  'dashboard-ui': {
    runtime: 'React + TypeScript',
    license: 'MIT',
    updated: '5 days ago',
    tags: ['dashboard', 'admin', 'ui', 'charts', 'react', 'tables'],
    scopes: ['ui.render', 'pack.bind'],
    actions: ['render_dashboard', 'bind_data_source', 'configure_sidebar', 'add_widget'],
    compatible: [
      { name: 'Auth Pack', slug: 'auth-pack' },
      { name: 'Form Builder', slug: 'form-builder' },
      { name: 'Postgres Connector', slug: 'postgres-connector' },
    ],
    overview: {
      about: "Dashboard UI gives you a production-ready admin interface in minutes. Includes responsive layouts, data visualization components, real-time stat cards, and full sidebar navigation — all generated as pack-aware React components that bind directly to your Logic Pack actions.",
      features: [
        'Responsive sidebar layout with collapsible navigation',
        'Data tables with sorting, filtering, pagination, and row actions',
        'Chart components (bar, line, pie, area) powered by Recharts',
        'Stat cards with trend indicators and sparklines',
        'Auto-binds to Logic Pack endpoints via Compose',
        'Dark mode support with Tailwind CSS',
      ],
      quickStart: {
        lang: 'javascript',
        code: `import { Dashboard, Sidebar, DataTable } from "@logicpacks/dashboard-ui"
import { usePackAction } from "@logicpacks/compose"

export default function AdminPanel() {
  const users = usePackAction("auth-pack", "list_users")

  return (
    <Dashboard>
      <Sidebar items={["Users", "Payments", "Settings"]} />
      <DataTable data={users} columns={["name", "email", "role"]} />
    </Dashboard>
  )
}`,
      },
    },
    contracts: `# pack.manifest.yaml
name: dashboard-ui
version: 2.4.1
type: ui
runtime: react + typescript

contracts:
  components:
    - Dashboard   # Main layout wrapper
    - Sidebar     # Collapsible nav
    - DataTable   # Advanced data grid
    - StatCard    # Metric display
    - Chart       # Bar, Line, Pie, Area
  bindings:
    - pack.action → table.dataSource
    - pack.action → chart.data
  scopes:
    - ui.render
    - pack.bind

tests:
  runner: vitest
  count: 38
  coverage: 89%`,
    deps: [
      { name: 'react', version: '>=18', type: 'npm', required: true },
      { name: 'recharts', version: '>=2.8', type: 'npm', required: true },
      { name: 'tailwindcss', version: '>=3.4', type: 'npm', required: true },
      { name: '@logicpacks/compose', version: '>=1.0', type: 'npm', required: true },
    ],
    changelog: [
      { ver: '2.4.1', date: 'Feb 13, 2026', title: 'Table export fix', desc: 'Fixed CSV export breaking on special characters. Added UTF-8 BOM support.', type: 'patch' },
      { ver: '2.4.0', date: 'Feb 5, 2026', title: 'Sparkline stat cards', desc: 'StatCard now supports inline sparkline charts for trend visualization.', type: 'feature' },
      { ver: '2.3.0', date: 'Jan 20, 2026', title: 'Dark mode', desc: 'Full dark mode support using Tailwind CSS dark: variants. Auto-detects system preference.', type: 'feature' },
    ],
    related: ['auth-pack', 'form-builder', 'data-table', 'landing-kit'],
  },

  'payments-pack': {
    runtime: 'Python',
    license: 'MIT',
    updated: '1 week ago',
    tags: ['payments', 'stripe', 'checkout', 'subscriptions', 'invoices', 'webhooks'],
    scopes: ['db.read', 'db.write', 'secrets.read', 'network.outbound'],
    actions: ['create_checkout', 'manage_subscription', 'handle_webhook', 'generate_invoice', 'refund'],
    compatible: [
      { name: 'Auth Pack', slug: 'auth-pack' },
      { name: 'Dashboard UI', slug: 'dashboard-ui' },
      { name: 'Email Service', slug: 'email-service' },
    ],
    overview: {
      about: "Payments Pack wraps Stripe's full API into a clean, composable pack. Handle one-time charges, recurring subscriptions, webhooks, invoice generation, and refunds — all with built-in retry logic and self-healing for failed webhook deliveries.",
      features: [
        'Stripe Checkout integration with hosted and embedded modes',
        'Subscription lifecycle management (create, upgrade, cancel, pause)',
        'Webhook handler with signature verification and retry queue',
        'Invoice generation and PDF export',
        'Self-healing: auto-retries failed webhooks, alerts on payment anomalies',
      ],
      quickStart: {
        lang: 'python',
        code: `from packs import PaymentsPack

payments = PaymentsPack.install(app)

# Create a checkout session
@app.post("/checkout")
async def checkout(plan: str):
    session = await payments.create_checkout(
        plan=plan,
        success_url="/success",
        cancel_url="/cancel"
    )
    return {"url": session.url}`,
      },
    },
    contracts: `# pack.manifest.yaml
name: payments-pack
version: 2.0.3
type: logic
runtime: python >= 3.10

contracts:
  actions:
    - create_checkout
    - manage_subscription
    - handle_webhook
    - generate_invoice
    - refund
  scopes:
    - db.read
    - db.write
    - secrets.read
    - network.outbound

tests:
  runner: pytest
  count: 52
  coverage: 91%`,
    deps: [
      { name: 'stripe', version: '>=7.0', type: 'pip', required: true },
      { name: 'fastapi', version: '>=0.104', type: 'pip', required: true },
      { name: 'postgres-connector', version: '>=2.0', type: 'pack', required: true },
    ],
    changelog: [
      { ver: '2.0.3', date: 'Feb 11, 2026', title: 'Webhook retry fix', desc: 'Self-healing patch: improved dead-letter queue handling for timed-out webhook deliveries.', type: 'patch' },
      { ver: '2.0.0', date: 'Jan 30, 2026', title: 'Subscription lifecycle', desc: 'Breaking: New subscription management actions. Supports pause, resume, and plan upgrades.', type: 'breaking' },
    ],
    related: ['auth-pack', 'dashboard-ui', 'email-service', 'postgres-connector'],
  },

  'web-scraper': {
    runtime: 'Node.js',
    license: 'MIT',
    updated: '4 days ago',
    tags: ['scraping', 'puppeteer', 'automation', 'data-extraction', 'headless'],
    scopes: ['network.outbound', 'filesystem.write', 'runtime.browser'],
    actions: ['scrape_page', 'scrape_list', 'extract_structured', 'screenshot', 'pdf_export'],
    compatible: [
      { name: 'Postgres Connector', slug: 'postgres-connector' },
      { name: 'S3 Storage', slug: 's3-connector' },
      { name: 'Task Scheduler', slug: 'scheduler' },
    ],
    overview: {
      about: 'Web Scraper provides production-grade web scraping on managed infrastructure. Uses Puppeteer for headless Chrome automation with built-in retry logic, proxy rotation, rate limiting, and structured data extraction via CSS selectors or AI-powered parsing.',
      features: [
        'Headless Chrome via Puppeteer on managed infra',
        'Proxy rotation pool with geo-targeting',
        'Smart retry with exponential backoff',
        'Structured data extraction from HTML tables and lists',
        'Screenshot and PDF capture modes',
      ],
      quickStart: {
        lang: 'javascript',
        code: `const { WebScraper } = require("@logicpacks/web-scraper")

const scraper = new WebScraper({ retries: 3, proxy: "auto" })

const data = await scraper.extract({
  url: "https://example.com/products",
  selector: ".product-card",
  fields: { title: "h3", price: ".price", link: "a@href" }
})`,
      },
    },
    contracts: `# pack.manifest.yaml
name: web-scraper
version: 1.5.0
type: automation
runtime: node >= 18

contracts:
  actions:
    - scrape_page
    - scrape_list
    - extract_structured
    - screenshot
    - pdf_export
  scopes:
    - network.outbound
    - filesystem.write
    - runtime.browser

tests:
  runner: jest
  count: 31`,
    deps: [
      { name: 'puppeteer', version: '>=21', type: 'npm', required: true },
      { name: 'cheerio', version: '>=1.0', type: 'npm', required: true },
    ],
    changelog: [
      { ver: '1.5.0', date: 'Feb 14, 2026', title: 'AI-powered parsing', desc: 'New: Use LLM-powered extraction for unstructured pages. Falls back to CSS selectors.', type: 'feature' },
      { ver: '1.4.2', date: 'Feb 1, 2026', title: 'Proxy pool expansion', desc: 'Added 12 new proxy regions. Improved rotation algorithm for better success rates.', type: 'improvement' },
    ],
    related: ['pdf-generator', 'postgres-connector', 'scheduler', 's3-connector'],
  },

  'image-gen': {
    runtime: 'Python',
    license: 'MIT',
    updated: '3 days ago',
    tags: ['image', 'ai', 'generation', 'dalle', 'stable-diffusion', 'creative'],
    scopes: ['network.outbound', 'secrets.read', 'filesystem.write'],
    actions: ['generate', 'batch_generate', 'upscale', 'style_transfer', 'remove_background'],
    compatible: [
      { name: 'S3 Storage', slug: 's3-connector' },
      { name: 'OpenAI Connector', slug: 'openai-connector' },
    ],
    overview: {
      about: "Image Generator unifies multiple AI image models behind one clean interface. Switch between DALL·E 3, Stable Diffusion XL, and Midjourney API without changing your code. Includes batch processing, style presets, upscaling, and background removal.",
      features: [
        'Multi-model: DALL·E 3, SDXL, Midjourney API',
        'Batch generation with progress tracking',
        'Style presets (photorealistic, illustration, abstract, etc.)',
        'AI upscaling (2x, 4x) and background removal',
      ],
      quickStart: {
        lang: 'python',
        code: `from packs import ImageGen

gen = ImageGen.install(app, model="dalle-3")

result = await gen.generate(
    prompt="A minimalist logo for a tech startup",
    style="flat-vector",
    size="1024x1024"
)`,
      },
    },
    contracts: `# pack.manifest.yaml
name: image-gen
version: 1.2.0
type: creative
runtime: python >= 3.10

contracts:
  actions:
    - generate
    - batch_generate
    - upscale
    - style_transfer
    - remove_background
  scopes:
    - network.outbound
    - secrets.read
    - filesystem.write`,
    deps: [
      { name: 'openai', version: '>=1.0', type: 'pip', required: true },
      { name: 'diffusers', version: '>=0.25', type: 'pip', required: false },
      { name: 'Pillow', version: '>=10.0', type: 'pip', required: true },
    ],
    changelog: [
      { ver: '1.2.0', date: 'Feb 15, 2026', title: 'Background removal', desc: 'New remove_background action using segment-anything model.', type: 'feature' },
      { ver: '1.1.0', date: 'Feb 1, 2026', title: 'Batch mode', desc: 'Generate multiple images in parallel with progress callbacks.', type: 'feature' },
    ],
    related: ['html-prototyper', 's3-connector', 'openai-connector', 'landing-kit'],
  },

  'postgres-connector': {
    runtime: 'Python',
    license: 'MIT',
    updated: '6 days ago',
    tags: ['database', 'postgres', 'sql', 'migrations', 'provider'],
    scopes: ['db.read', 'db.write', 'db.migrate'],
    actions: ['query', 'migrate', 'sync_schema', 'pool_status', 'backup'],
    compatible: [
      { name: 'Auth Pack', slug: 'auth-pack' },
      { name: 'Payments Pack', slug: 'payments-pack' },
      { name: 'REST API Scaffold', slug: 'crud-generator' },
    ],
    overview: {
      about: 'Postgres Connector provides a clean, reliable interface to PostgreSQL. Connection pooling, automatic migrations, a type-safe query builder, and schema synchronization — all wrapped in the pack standard with full test coverage.',
      features: [
        'Connection pooling with automatic scaling',
        'Zero-downtime schema migrations',
        'Type-safe query builder with ORM-like syntax',
        'Automatic backup scheduling',
      ],
      quickStart: {
        lang: 'python',
        code: `from packs import PostgresConnector

db = PostgresConnector.install(app, url="postgres://...")

users = await db.query("users").where(role="admin").limit(10).all()`,
      },
    },
    contracts: `# pack.manifest.yaml
name: postgres-connector
version: 2.3.0
type: provider
runtime: python >= 3.10

contracts:
  actions:
    - query
    - migrate
    - sync_schema
    - pool_status
    - backup
  scopes:
    - db.read
    - db.write
    - db.migrate

tests:
  runner: pytest
  count: 56
  coverage: 96%`,
    deps: [
      { name: 'asyncpg', version: '>=0.29', type: 'pip', required: true },
      { name: 'alembic', version: '>=1.13', type: 'pip', required: true },
      { name: 'sqlalchemy', version: '>=2.0', type: 'pip', required: true },
    ],
    changelog: [
      { ver: '2.3.0', date: 'Feb 12, 2026', title: 'Auto-backup', desc: 'New backup action with scheduling. Supports S3 and local storage targets.', type: 'feature' },
      { ver: '2.2.1', date: 'Jan 25, 2026', title: 'Pool tuning', desc: 'Self-healing: auto-adjusts pool size based on connection wait time metrics.', type: 'improvement' },
    ],
    related: ['auth-pack', 'payments-pack', 'crud-generator', 'redis-connector'],
  },
};

// Mini data for related pack cards (for packs not in the main PACKS array or for quick lookup)
export const PACK_MINI = {
  'auth-pack': { name: 'Auth Pack', icon: 'solar:shield-keyhole-linear', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', type: 'Logic' },
  'payments-pack': { name: 'Payments Pack', icon: 'solar:card-linear', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', type: 'Logic' },
  'dashboard-ui': { name: 'Dashboard UI', icon: 'solar:chart-2-linear', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', type: 'UI' },
  'form-builder': { name: 'Form Builder', icon: 'solar:clipboard-list-linear', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', type: 'UI' },
  'web-scraper': { name: 'Web Scraper', icon: 'solar:spider-linear', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', type: 'Automation' },
  'postgres-connector': { name: 'Postgres Connector', icon: 'solar:database-linear', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', type: 'Provider' },
  'email-service': { name: 'Email Service', icon: 'solar:letter-linear', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', type: 'Logic' },
  'social-auth': { name: 'Social Auth', icon: 'solar:users-group-rounded-linear', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', type: 'Logic' },
  'data-table': { name: 'Data Table Pro', icon: 'solar:list-bold-linear', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', type: 'UI' },
  'landing-kit': { name: 'Landing Page Kit', icon: 'solar:window-frame-linear', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', type: 'UI' },
  'pdf-generator': { name: 'PDF Generator', icon: 'solar:document-text-linear', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', type: 'Automation' },
  'scheduler': { name: 'Task Scheduler', icon: 'solar:clock-circle-linear', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', type: 'Automation' },
  'image-gen': { name: 'Image Generator', icon: 'solar:gallery-wide-linear', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', type: 'Creative' },
  'html-prototyper': { name: 'HTML Prototyper', icon: 'solar:code-linear', color: 'text-lime-400', bg: 'bg-lime-500/10', border: 'border-lime-500/20', type: 'Creative' },
  'redis-connector': { name: 'Redis Connector', icon: 'solar:bolt-circle-linear', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', type: 'Provider' },
  's3-connector': { name: 'S3 Storage', icon: 'solar:cloud-storage-linear', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', type: 'Provider' },
  'openai-connector': { name: 'OpenAI Connector', icon: 'solar:star-linear', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', type: 'Provider' },
  'crud-generator': { name: 'REST API Scaffold', icon: 'solar:server-linear', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', type: 'Logic' },
};

