import re

def extract_json(text):
    # 匹配 ```json\n{...}\n``` 结构或直接 { 开头
    match = re.search(r"```json\s*({.*?})\s*```", text, re.DOTALL)
    if match:
        return match.group(1)
    elif text.strip().startswith("{"):
        return text.strip()
    else:
        return None