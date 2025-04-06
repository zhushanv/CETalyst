import csv

cet4 = set()
cet6 = set()

with open(r'D:\Projects\CETalyst\words\ecdict.csv', 'r', encoding='utf-8') as f:
    reader  = csv.DictReader(f)
    for row in reader:
        tags = row['tag'].split() if row['tag'] else []
        word = row['word'].lower()
        if 'cet4' in tags:
            cet4.add(word)
        elif 'cet6' in tags:
            cet6.add(word)

with open('cet4.txt', 'w', encoding='utf-8') as f2:
    f2.write('\n'.join(sorted(cet4)))

with open('cet6.txt', 'w', encoding='utf-8') as f3:
    f3.write('\n'.join(sorted(cet6)))