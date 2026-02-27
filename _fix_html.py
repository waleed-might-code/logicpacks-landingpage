"""Standardize header nav + footer across all HTML backup files."""
import re, os

FILES = {
    "index copy.html": None,  # home — no active subpage
    "cli.html": "cli",
    "ambassadors.html": "ambassadors",
    "courses.html": "courses",
    "founders.html": "founders",
}

NAV_LINKS = [
    ("index.html#modes", "Platform"),
    ("store.html", "Marketplace"),
    ("shop.html", "Shop"),
    ("ventures.html", "Ventures"),
    ("courses.html", "Learn"),
    ("ambassadors.html", "Ambassadors"),
    ("cli.html", "CLI"),
    ("index.html#pricing", "Pricing"),
]

MOBILE_LINKS = list(NAV_LINKS)  # same set

def make_nav(active_key):
    """Generate desktop nav HTML."""
    lines = []
    for href, label in NAV_LINKS:
        # Determine if this link is active
        key = href.replace(".html", "").replace("index.html#modes", "").replace("index.html#pricing", "")
        is_active = False
        if active_key and key == active_key:
            is_active = True
        cls = 'text-[11px] uppercase font-medium text-white tracking-[0.15em]' if is_active else 'text-[11px] hover:text-white transition-colors uppercase font-medium text-neutral-400 tracking-[0.15em]'
        lines.append(f'                <a href="{href}" class="{cls}">{label}</a>')
    return '\n'.join(lines)

def make_mobile_nav(active_key):
    """Generate mobile nav HTML."""
    lines = []
    for href, label in MOBILE_LINKS:
        key = href.replace(".html", "").replace("index.html#modes", "").replace("index.html#pricing", "")
        is_active = False
        if active_key and key == active_key:
            is_active = True
        if is_active:
            lines.append(f'            <a href="{href}" class="px-4 py-2 text-sm text-white bg-white/5 rounded-md">{label}</a>')
        else:
            lines.append(f'            <a href="{href}" class="px-4 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-md">{label}</a>')
    return '\n'.join(lines)

CANONICAL_FOOTER = '''    <!-- ═══ FOOTER ═══ -->
    <footer class="border-t border-white/[0.06]">
        <div class="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            <!-- Brand -->
            <div class="p-8 md:col-span-1 flex flex-col justify-between min-h-[280px]">
                <div>
                    <div class="flex items-center gap-2 mb-4">
                        <iconify-icon icon="solar:widget-5-linear" class="text-green-500 text-lg"></iconify-icon>
                        <span class="text-white font-semibold text-sm tracking-tight">Logic Packs</span>
                    </div>
                    <p class="text-neutral-500 text-sm leading-relaxed mb-6">The operating system for reusable software.</p>
                </div>
                <div class="flex gap-3">
                    <a href="#" class="w-8 h-8 rounded-md border border-white/[0.06] flex items-center justify-center hover:bg-white/5 transition-colors"><iconify-icon icon="simple-icons:github" class="text-neutral-500 text-sm"></iconify-icon></a>
                    <a href="#" class="w-8 h-8 rounded-md border border-white/[0.06] flex items-center justify-center hover:bg-white/5 transition-colors"><iconify-icon icon="simple-icons:discord" class="text-neutral-500 text-sm"></iconify-icon></a>
                    <a href="#" class="w-8 h-8 rounded-md border border-white/[0.06] flex items-center justify-center hover:bg-white/5 transition-colors"><iconify-icon icon="simple-icons:x" class="text-neutral-500 text-sm"></iconify-icon></a>
                </div>
            </div>

            <!-- Links -->
            <div class="p-8 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h4 class="text-white text-xs font-semibold uppercase tracking-widest mb-5">Platform</h4>
                    <ul class="space-y-3">
                        <li><a href="index.html#modes" class="text-neutral-500 text-sm hover:text-white transition-colors">UI Mode</a></li>
                        <li><a href="index.html#modes" class="text-neutral-500 text-sm hover:text-white transition-colors">Logic Mode</a></li>
                        <li><a href="index.html#modes" class="text-neutral-500 text-sm hover:text-white transition-colors">Notebook</a></li>
                        <li><a href="index.html#modes" class="text-neutral-500 text-sm hover:text-white transition-colors">Canvas</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white text-xs font-semibold uppercase tracking-widest mb-5">Ventures</h4>
                    <ul class="space-y-3">
                        <li><a href="ventures.html" class="text-neutral-500 text-sm hover:text-white transition-colors">Overview</a></li>
                        <li><a href="founders.html" class="text-neutral-500 text-sm hover:text-white transition-colors">For Founders</a></li>
                        <li><a href="investors.html" class="text-neutral-500 text-sm hover:text-white transition-colors">For Investors</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white text-xs font-semibold uppercase tracking-widest mb-5">Resources</h4>
                    <ul class="space-y-3">
                        <li><a href="#" class="text-neutral-500 text-sm hover:text-white transition-colors">Documentation</a></li>
                        <li><a href="cli.html" class="text-neutral-500 text-sm hover:text-white transition-colors">LPC CLI</a></li>
                        <li><a href="store.html" class="text-neutral-500 text-sm hover:text-white transition-colors">Pack Marketplace</a></li>
                        <li><a href="shop.html" class="text-neutral-500 text-sm hover:text-white transition-colors">Hardware Shop</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white text-xs font-semibold uppercase tracking-widest mb-5">Newsletter</h4>
                    <form class="flex flex-col gap-3" onsubmit="return false">
                        <input type="email" placeholder="you@email.com" class="w-full bg-transparent border-b border-white/15 py-2 text-white text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-neutral-700">
                        <button class="self-start text-xs text-neutral-500 uppercase tracking-widest hover:text-white transition-colors">Subscribe</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="border-t border-white/[0.06]">
            <div class="px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
                <span class="text-neutral-700 text-xs">&copy; 2026 Logic Packs. All rights reserved.</span>
                <div class="flex gap-4">
                    <a href="#" class="text-neutral-700 text-xs hover:text-white transition-colors">Privacy</a>
                    <a href="#" class="text-neutral-700 text-xs hover:text-white transition-colors">Terms</a>
                </div>
            </div>
        </div>
    </footer>'''

def fix_file(filepath, active_key):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Fix desktop nav: replace everything between <nav ...> and </nav>
    nav_pattern = r'(<nav class="hidden md:flex items-center gap-8">)\s*\n(.*?)\n(\s*</nav>)'
    new_nav = make_nav(active_key)
    def nav_replacer(m):
        return f'{m.group(1)}\n{new_nav}\n            </nav>'
    content = re.sub(nav_pattern, nav_replacer, content, flags=re.DOTALL)
    
    # Fix mobile nav: replace everything inside mobile-menu div
    mobile_pattern = r'(<div id="mobile-menu" class="hidden md:hidden[^"]*"[^>]*>)\s*\n(.*?)\n(\s*</div>\s*\n\s*</header>)'
    new_mobile = make_mobile_nav(active_key)
    def mobile_replacer(m):
        return f'{m.group(1)}\n{new_mobile}\n        </div>\n    </header>'
    content = re.sub(mobile_pattern, mobile_replacer, content, flags=re.DOTALL)
    
    # Fix footer: replace the entire footer block
    # Match from <!-- ═══ FOOTER ═══ --> or <!-- FOOTER --> to </footer>
    footer_pattern = r'    <!-- [═\s]*FOOTER[═\s]*-->\s*\n.*?</footer>'
    content = re.sub(footer_pattern, CANONICAL_FOOTER, content, flags=re.DOTALL)
    
    # For index copy.html, fix the href="/" to href="index.html"
    if "index copy" in filepath:
        content = content.replace('href="/"', 'href="index.html"')
        # Also fix #modes and #pricing links on the home page to be anchor-only
        content = content.replace('href="index.html#modes"', 'href="#modes"', 1)  # only in nav
        content = content.replace('href="index.html#pricing"', 'href="#pricing"', 1)  # only in nav
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"✅ Fixed: {filepath}")

for filename, active in FILES.items():
    path = os.path.join('.', filename)
    if os.path.exists(path):
        fix_file(path, active)
    else:
        print(f"⚠️  Not found: {filename}")

print("\nDone! All files standardized.")

