import os, re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix useState([]) -> useState<any[]>([])
    content = re.sub(r'useState\(\[\]\)', 'useState<any[]>([])', content)
    
    # Fix useState(null) -> useState<any>(null)
    content = re.sub(r'useState\(null\)', 'useState<any>(null)', content)

    # Fix component props: function Comp({ a, b }) -> function Comp({ a, b }: any)
    content = re.sub(r'export default function (\w+)\(({\s*[^}]+?\s*})\)', r'export default function \1(\2: any)', content)
    content = re.sub(r'function (\w+)\(({\s*[^}]+?\s*})\)', r'function \1(\2: any)', content)

    # Fix arrow functions: const Comp = ({ a, b }) => -> const Comp = ({ a, b }: any) =>
    content = re.sub(r'const (\w+) = \(({\s*[^}]+?\s*})\) =>', r'const \1 = (\2: any) =>', content)

    # Fix catch(error) -> catch(error: any)
    content = re.sub(r'catch\s*\(\s*(err|error)\s*\)', r'catch(\1: any)', content)

    # Fix map((item) =>) -> map((item: any) =>)
    content = re.sub(r'\.map\(\s*\(?([a-zA-Z0-9_]+)\)?\s*=>', r'.map((\1: any) =>', content)
    
    # Fix find((item) =>) -> find((item: any) =>)
    content = re.sub(r'\.find\(\s*\(?([a-zA-Z0-9_]+)\)?\s*=>', r'.find((\1: any) =>', content)
    
    # Fix filter((item) =>) -> filter((item: any) =>)
    content = re.sub(r'\.filter\(\s*\(?([a-zA-Z0-9_]+)\)?\s*=>', r'.filter((\1: any) =>', content)

    # Fix main.tsx createRoot
    if 'main.tsx' in filepath:
        content = content.replace("document.getElementById('root')", "document.getElementById('root')!")

    # Fix api.ts if any
    if 'api.ts' in filepath:
        content = content.replace('error =>', '(error: any) =>')

    with open(filepath, 'w') as f:
        f.write(content)

src_dir = 'frontend/src'
for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            process_file(os.path.join(root, f))
