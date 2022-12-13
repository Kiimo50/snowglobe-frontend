import json

with open('claims.json') as f:
    claims = json.load(f)

with open('claims.txt', 'w') as f:
    for claim in list(claims):
        f.write(claim + '\n')
