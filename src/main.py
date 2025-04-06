from fastapi import FastAPI, Request
from pydantic import BaseModel
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
from nltk import pos_tag
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware
#from spacy
import uvicorn
import nltk

# 加载 spaCy 英语模型
#nlp = spacy.load("en_core_web_sm")

# 下载 punkt 资源
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download('averaged_perceptron_tagger_eng') 

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


# 添加 CORS 中间件
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

    return {
        "CET-4": sorted(set(cet4)),
        "CET-6": sorted(set(cet6)),
        "其他": sorted(set(other))
    }

# 本地启动
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
