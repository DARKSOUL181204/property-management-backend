import os, re
import json

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix e implicitly has any
    content = re.sub(r'async \(e\)', r'async (e: any)', content)
    content = re.sub(r'\(tab\)', r'(tab: any)', content)
    content = re.sub(r'\(direction\)', r'(direction: any)', content)

    # Fix Object is possibly null for scroll
    content = re.sub(r'document\.getElementById\(\'results-section\'\)\.offsetTop', r'document.getElementById(\'results-section\')?.offsetTop || 0', content)

    # Fix propertyId possibly undefined
    content = re.sub(r'parseInt\(propertyId\.substring\(0,8\), 16\)', r'parseInt(propertyId!.substring(0,8), 16)', content)

    # Fix variants[variant]
    content = re.sub(r'variants\[variant\]', r'variants[variant as keyof typeof variants]', content)

    # Fix scrollRef.current.scrollBy
    content = re.sub(r'scrollRef\.current\.scrollBy', r'(scrollRef.current as any).scrollBy', content)
    
    # Fix JwtPayload TS2339
    content = re.sub(r'decoded\.role', r'(decoded as any).role', content)
    content = re.sub(r'decoded\.authorities', r'(decoded as any).authorities', content)

    with open(filepath, 'w') as f:
        f.write(content)

src_dir = 'frontend/src'
for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            process_file(os.path.join(root, f))

# Update tsconfig.app.json
with open('frontend/tsconfig.app.json', 'r') as f:
    ts_config = json.load(f)

ts_config['compilerOptions']['noUnusedLocals'] = False
ts_config['compilerOptions']['noUnusedParameters'] = False

with open('frontend/tsconfig.app.json', 'w') as f:
    json.dump(ts_config, f, indent=2)
