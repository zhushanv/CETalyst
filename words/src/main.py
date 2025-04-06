from fastapi import FastAPI, Request
from pydantic import BaseModel
from nltk.tokenize import word_tokenize
from typing import List, Dict
import uvicorn
import nltk

# 下载 punkt 资源
nltk.download('punkt')
nltk.download('punkt_tab')

# 加载词表
def load_word_list(path: str) -> set:
    with open(path, 'r', encoding='utf-8') as f:
        return set(word.strip().lower() for word in f if word.strip())

cet4_words = load_word_list('cet4.txt')
cet6_words = load_word_list('cet6.txt')

# 创建 FastAPI 实例
app = FastAPI()

# 请求模型
class TextInput(BaseModel):
    text: str

@app.get("/")
def test():
    return {"message": "Hello, World!"}

@app.post("/classify")
# 在输入之前需要转换为单词原型 
def classify_words(input: TextInput) -> Dict[str, List[str]]:
    tokens = word_tokenize(input.text.lower())
    words = [word for word in tokens if word.isalpha()]

    cet4 = []
    cet6 = []
    other = []

    for word in words:
        if word in cet4_words:
            cet4.append(word)
        elif word in cet6_words:
            cet6.append(word)
        else:
            other.append(word)

    return {
        "CET-4": sorted(set(cet4)),
        "CET-6": sorted(set(cet6)),
        "其他": sorted(set(other))
    }

# 本地启动
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
