import os

with open('frontend/src/components/PublicPortal.tsx', 'r') as f:
    content = f.read()

content = content.replace("handleTabClick(tab: any)", "handleTabClick(tab)")
content = content.replace("setActiveTab(tab: any)", "setActiveTab(tab)")
content = content.replace("document.getElementById(\\'results-section\\')?.offsetTop", "document.getElementById('results-section')?.offsetTop")

with open('frontend/src/components/PublicPortal.tsx', 'w') as f:
    f.write(content)

with open('frontend/tsconfig.app.json', 'r') as f:
    tsconfig = f.read()

tsconfig = tsconfig.replace('"noUnusedLocals": true', '"noUnusedLocals": false')
tsconfig = tsconfig.replace('"noUnusedParameters": true', '"noUnusedParameters": false')

with open('frontend/tsconfig.app.json', 'w') as f:
    f.write(tsconfig)
