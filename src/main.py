from fastapi import FastAPI
from pydantic import BaseModel
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
from nltk.data import path as nltk_path
from nltk import pos_tag, download
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware
from api.cohere import build_messages, client
from api.extract_json import extract_json
#from spacy
import uvicorn
import nltk
import json

nltk.download(
    [
        "punkt", 
        "wordnet", 
        "omw-1.4", 
        "averaged_perceptron_tagger_eng",
        "punkt_tab"  # 注意：这是 punkt 的补充数据（可选）
    ]
)
                                                        
# 加载词表
def load_word_list(path: str) -> set:
    with open(path, 'r', encoding='utf-8') as f:
        return set(word.strip().lower() for word in f if word.strip())

cet4_words = load_word_list('cet4.txt')
cet6_words = load_word_list('cet6.txt')

# 创建 FastAPI 实例
app = FastAPI()

# 初始化词形还原器
lemmatizer = WordNetLemmatizer()


# 添加 CORS 中间件，便于跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源的请求，生产环境中应指定具体的源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 请求模型
class TextInput(BaseModel):
    text: str

@app.get("/")
def test():
    return {"message": "Hello, World!"}

def get_wordnet_pos(treebank_tag):
    #将树库标签转换为WordNet标签
    if treebank_tag.startswith('J'):
        return wordnet.ADJ
    elif treebank_tag.startswith('V'):
        return wordnet.VERB
    elif treebank_tag.startswith('N'):
        return wordnet.NOUN
    elif treebank_tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN

#分词
@app.post("/classify")
# 在输入之前需要转换为单词原型 
def classify_words(input: TextInput) -> Dict[str, List[str]]:
    tokens = word_tokenize(input.text.lower())
    pos_tags = pos_tag(tokens)
     # 词形还原
    lemmas = [
        lemmatizer.lemmatize(token, get_wordnet_pos(pos)) 
        for token, pos in pos_tags
        ]

    cet4 = set()
    cet6 = set()
    other = set()

    for lemma in lemmas:
        print(lemma)
        if lemma in cet4_words:
            cet4.add(lemma)
        elif lemma in cet6_words:
            cet6.add(lemma)
        else:
            other.add(lemma)

    # print("cet4:", cet4)
    # print("cet6:", cet6)

    return {
        "CET-4": sorted(set(cet4)),
        "CET-6": sorted(set(cet6)),
        "其他": sorted(set(other))
    }

@app.post("/analyze")
def analyzeText(input: TextInput):
    print(input.text)
    messages = build_messages(input.text)
    print(messages)
    response = client.chat.completions.create(
        # response_format={"type": "json_object"},
        model="deepseek-chat",
        messages=messages,
        max_tokens=8190
    )
    ans = extract_json(response.choices[0].message.content)
    print("ansJSON", json.loads(ans))
    return json.loads(ans)

# 本地启动
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8002, reload=True)
