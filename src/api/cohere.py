from openai import OpenAI
from . import config

client = OpenAI(api_key=config.COHERE_API_KEY , base_url="https://api.deepseek.com")

def build_messages(text):
    return [
        {
            "role": "system",
            "content": (
                "You are an expert in English grammar and writing. "
                "You are helping Chinese students prepare for the CET-4 and CET-6 exams. "
                "Your task is to analyze a complex English passage and extract:\n"
                "1) paragraph structure,\n"
                "2) beautiful expressions,\n"
                "3) grammar highlights,\n"
                "4) writing techniques.\n\n"
                "Return your response in **valid JSON format only**, no explanations, no extra comments. "
                "The structure should look like this:\n\n"
                "{\n"
                '  "structure": ["主题句：...", "扩展说明：..."],\n'
                '  "expressions": [\n'
                '    { "phrase": "quiet joys", "meaning": "静谧的喜悦", "comment": "quiet的妙用" }\n'
                "  ],\n"
                '  "grammar": ["被动语态...", "现在分词..."],\n'
                '  "tips": ["双重好处表达法...", "场景描写技巧..."]\n'
                "}\n\n"
                "Respond in Chinese."
            )
        },
        {
            "role": "user",
            "content": f"请分析以下英文段落：\n\n\"{text}\""
        }
    ]
