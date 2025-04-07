const pasteText = document.getElementById('text');
const result = document.getElementById('result');
const card1 = document.getElementById('card1');
const card2 =  document.getElementById('card2');
const card3 =  document.getElementById('card3');

let response;  
let responseData;
let base_url = "https://api.dictionaryapi.dev/api/v2/entries/en/"
let input;
//全局数组可能会存在问题
let CET4 = [];
let CET6 = [];

async function analyze() {
    input = pasteText.value;
    console.log("pasteText",input);
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
        CET4 = [];
        result.innerHTML = " ";
        for (const word of responseData["CET-4"]) {
            const data = await wordSearch(word);
            CET4.push(data);
            if (data && data.length > 0) {
                const wordData = data[0];
                //console.log(wordData);
                let html = `
                    <div class="word-header">${wordData.word}</div>
                `;

                // 添加音标或音频（如果有）
                if (wordData.phonetic || (wordData.phonetics && wordData.phonetics.length > 0)) {
                    let phoneticText = wordData.phonetic;
                    let audioSrc = null;

                    if (wordData.phonetics && wordData.phonetics.length > 0) {
                        const phonetic = wordData.phonetics.find(p => p.text)?.text;
                        if (phonetic) {
                            phoneticText = phonetic;
                        }
                        audioSrc = wordData.phonetics[0].audio;
                    }

                    html += `<div class="voice">`;

                    if (phoneticText) {
                        html += `<div class="phonetic">音标: ${phoneticText}</div>`;
                    }

                    if (audioSrc) {
                        html += `<audio src="${audioSrc}" controls></audio>`;
                    }

                    html += `</div>`;
                }

                // 添加词义和例句,嵌套循环展示多个词性和词义
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
        CET6 = [];
        result.innerHTML = " ";
            for (const word of responseData["CET-6"]) {
                const data = await wordSearch(word);
                CET6.push(data);
                if (data && data.length > 0) {
                    const wordData = data[0];
                    //console.log(wordData);
                    let html = `
                        <div class="word-header">${wordData.word}</div>
                    `;
    
                    // 添加音标或音频（如果有）
                    if (wordData.phonetic || (wordData.phonetics && wordData.phonetics.length > 0)) {
                        let phoneticText = wordData.phonetic;
                        let audioSrc = null;

                        if (wordData.phonetics && wordData.phonetics.length > 0) {
                            const phonetic = wordData.phonetics.find(p => p.text)?.text;
                            if (phonetic) {
                                phoneticText = phonetic;
                            }
                            audioSrc = wordData.phonetics[0].audio;
                        }

                        html += `<div class="voice">`;

                        if (phoneticText) {
                            html += `<div class="phonetic">音标: ${phoneticText}</div>`;
                        }

                        if (audioSrc) {
                            html += `<audio src="${audioSrc}" controls></audio>`;
                            
                        }

                        html += `</div>`;
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
    } else {
        result.innerHTML = " ";
        // 接入大模型api进行词句分析
    }
    displayResult(id);
}

function showPassage(id){
    if(id === 2){
        input = `Let's Dress Up——It's HalloweenFrom early childhood getting dressed up is connected with a special pastime in North America,called Halloween.

Halloween is celebrated on the last night of October, when the air is crisp and snow is not far off. Every young child is acquainted with this exciting tradition.
On the last day of October when dinner is finished,children hurry to dress up in a costume. Darkness comes early at this time of year and caution must be practiced, 
foremost by the children who are going from house to house, “trick or treat”.

Parents warn their children not to dart out in front of cars. In all the excitement it is easy for children to become distracted and ignore safety rules.Planning what 
your costume will be, ahead of time, is part of the fun of the evening. Many mothers will spend time fabricating outfits for their little girls who suddenly turn into 
circus clowns, beautiful ballet dancers or weird colorful bugs. Fathers may help their sons construct a costume of foil armor.

Little boys often enjoy pretending they are in the army so on Halloween it is possible to see squads of lieutenants and sergeants marching along in the dark. We affiliate 
this celebration with the supernatural so some children may choose to wear a skeleton costume bearing a skull and crossbones, or even a monster costume. The choice of wardrobe 
for the evening is really limitless. Witches can be seen riding on broomsticks across well illuminated intersections. Earlier in the evening they may have concocted a witch's brew 
to quench their thirst for their arrival home.`
    }else if(id === 1){
        input = `Gardening
One of the quiet joys of life in the southern part of Ontario, Canada, is gardening.

Whether pursued as a hobby or solely to improve the esthetic value of one's home, the pleasure derived is only exceeded by the therapeutic benefit. 
The exercise involved in working in a garden is helpful in keeping people in good physical condition.It has become a ritual for homeowners to spend late winter
 weekends browsing through seed catalogues while sitting on their couch. They make lists of items they wish to purchase and often make notations right on the catalogue 
 as they make decisions about this year's garden.If they order early, there is usually a discount coupon, allowing a percentage of the cost to be deducted from the price.`

    }
    else{
        input = `In 1950, I was six and my brother was five when we last visited our mother's childhood home. At that time, Ireland's Eye was a vibrant, quaint fishing village 
        hugging the rocky shore of a small, enclosed harbour. There was no electricity. There were no roads, no automobiles, and few signsof automation of any type. There were oil 
        lamps and wood stoves in the homes and mere sootpaths between the aggregate of small communities on the hilly island, also named Ireland's Eye. We can still see and hear the 
        inboard motorboats, putt putting (sound of engines) into the harbour, hauling their day's catch of fish. The image of hardy fishermen with pitchforks hoisting and tossing the 
        codfish up to the stilted platforms from the bowels of the boats is still quite vivid. The aroma of salted, drying codfish, lingers still.

        What I remember best, of almost half a century ago,was going out with my Uncle Fred in his boat to fish. That particular day, we were huddled together and lashed to other boats, just 
        outside of the harbour. I can still hear the lively gossip between my uncle and the other fishermen, above the rippling and splashing of the waves against the hulls of the boats. I remember 
        the boats heaving periodically, on the huge gently rolling waves.`
    }
    pasteText.innerHTML= input;
}

//接入词典api
function displayResult(id){
    if(id === 1){
        console.log(CET4);
        card1.querySelector('.list').innerHTML = ``;
        let html =`
                    <dl>`;       
        for(data of CET4){
            html += `
                  <div>
                    <dt>${data[0].word}</dt>
            `
            console.log("data:",  data);
            for(wordData of data){
                console.log("wordData",wordData);
                    for(meanings of wordData.meanings){
                        partOfSpeech = meanings.partOfSpeech;
                        html += `<dd>${partOfSpeech}:${meanings.definitions[0].definition} <dd>`
                    }
            }
            html += `</dl>`;
        }
        html += `</dl>
                `
        card1.querySelector('.list').innerHTML += html;
    }
    else if(id === 2){
        console.log(CET6);
        card2.querySelector('.list').innerHTML = ``;
        let html =`
                    <dl>`;       
        for(data of CET6){
            html += `
                  <div>
                    <dt>${data[0].word}</dt>
            `
            for(wordData of data){
                    for(meanings of wordData.meanings){
                        partOfSpeech = meanings.partOfSpeech;
                        html += `<dd>${partOfSpeech}:${meanings.definitions[0].definition} <dd>`
                    }
            }
            html += `</dl>`;
        }
        html += `</dl>
                `
        card2.querySelector('.list').innerHTML += html;
    }
    else{
        card3.querySelector('.list').innerHTML = ``;

    }
    
    
}


document.getElementById('export-pdf').addEventListener('click', () => {
    const element = document.getElementById('result'); // 假设要导出的内容在id为'result'的元素中
    
    // 临时保存原始的overflow样式
    const originalOverflowY = element.style.overflowY;
    const originalOverflowX = element.style.overflowX;
    
    // 设置overflow为visible以确保所有内容都被包含在内
    element.style.overflowY = 'visible';
    element.style.overflowX = 'visible';
    
    html2pdf(element, {
        margin: 10,
        filename: 'word_definitions.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).then(() => {
        // 恢复原始的overflow样式
        element.style.overflowY = originalOverflowY;
        element.style.overflowX = originalOverflowX;
    });
});