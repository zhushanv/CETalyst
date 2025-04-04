const pasteText = Document.getElementById('text');
const result = Document.getElementById('result');
const url = 

pasteText.addEventListener('input', () => {
    let input = pasteText.value;
    console.log(input);

    if (input.length > 0) {
        analyze(input);
    } else {
        result.innerHTML = 'No text';
    }
});

function analyze(input){
    fetch()
}