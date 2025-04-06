const pasteText = document.getElementById('text');
const result = document.getElementById('result');

let response;  
let responseData;
let base_url = "https://api.dictionaryapi.dev/api/v2/entries/en/"
async function analyze() {
    const input = pasteText.value;
    try {
        response = await fetch("http://127.0.0.1:8002/classify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "text": input
            })
        });
        responseData = await response.json();
        console.log( "responseData:",responseData);
    } catch (error) {
        console.error("请求失败:", error);
    }

    displayResult();
}

async function wordSearch(word) {
    // 接入词典api
    let ans;
    const url = `${base_url}${word}`;
    try {
        const response = await fetch(url);
        ans = await response.json();
    } catch (error) {
        console.error('Error:', error);
        ans = null; // 或者返回一个默认值
    }
    return ans;
}
async function showWord(id) {
    if (id === 1) {
        for (const word of responseData["CET-4"]) {
            const data = await wordSearch(word);
            if (data && data.length > 0) {
                const wordData = data[0];
                let html = `
                    <div class="word-header">${wordData.word}</div>
                `;

                // 添加音标（如果有）
                if (wordData.phonetic) {
                    html += `<div class="phonetic">音标: /${wordData.phonetic}/</div>`;
                } else if (wordData.phonetics && wordData.phonetics.length > 0) {
                    const phonetic = wordData.phonetics.find(p => p.text)?.text;
                    if (phonetic) {
                        html += `<div class="phonetic">音标: /${phonetic}/</div>`;
                    }
                }

                // 添加词义和例句
                wordData.meanings.forEach(meaning => {
                    html += `
                        <div class="meaning">
                            <div class="part-of-speech">${meaning.partOfSpeech}</div>
                    `;

                    meaning.definitions.forEach((def, index) => {
                        html += `
                            <div class="definition">
                                ${index + 1}. ${def.definition}
                            </div>
                        `;

                        if (def.example) {
                            html += `
                                <div class="example">例句: "${def.example}"</div>
                            `;
                        }

                        // 可以添加同义词、反义词等
                        if (def.synonyms && def.synonyms.length > 0) {
                            html += `
                                <div class="synonyms">同义词: ${def.synonyms.join(', ')}</div>
                            `;
                        }
                    });

                    html += `</div>`;
                });

                result.innerHTML += html;
            }
        }
    } else if (id === 2) {
        // 处理 CET-6 的逻辑
        result.innerHTML = responseData["CET-6"].map(word => 
            `<span class="word4">${word}</span>`).join(' ');
    } else {
        // 接入大模型api进行词句分析
    }
}

//接入词典api
function displayResult() {
    let html = `
         <div class="list">
                    <dl>
                        <div>
                          <dt>A</dt>
                          <dd>Andrew W.K.</dd>
                          <dd>Apparat</dd>
                          <dd>Arcade Fire</dd>
                          <dd>At The Drive-In</dd>
                          <dd>Aziz Ansari</dd>
                        </div>
                        <div>
                          <dt>C</dt>
                          <dd>Chromeo</dd>
                          <dd>Common</dd>
                          <dd>Converge</dd>
                          <dd>Crystal Castles</dd>
                          <dd>Cursive</dd>
                        </div>
                        <div>
                          <dt>E</dt>
                          <dd>Explosions In The Sky</dd>
                        </div>
                        <div>
                          <dt>T</dt>
                          <dd>Ted Leo &amp; The Pharmacists</dd>
                          <dd>T-Pain</dd>
                          <dd>Thrice</dd>
                          <dd>TV On The Radio</dd>
                          <dd>Two Gallants</dd>
                        </div>
                      </dl>
                </div>
    `
}