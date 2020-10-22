var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent


var recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'tr-TR';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let cases = [" yazıyı sil", " yeniden başlat"];
var outputDOM = document.querySelector('.output');
outputDOM.textContent = `Bana tıkla ve konuşmaya başla, birikenleri silmek için "${cases[0]}" veya "${cases[1]}" de.`
let i = 0;
recognition.onresult = function (event) {
    let current_upper = event.results[i][0].transcript.toLocaleUpperCase();
    console.log(event, current_upper);
    switch (current_upper) {
        case cases[0].toLocaleUpperCase():
            outputDOM.textContent = "";
            i++;
            return;
        case cases[1].toLocaleUpperCase():
            window.location = window.location;
        break;
    }

    if (i === 0) {
        outputDOM.textContent = "";
    }
    outputDOM.textContent += event.results[i][0].transcript;
    console.log('Confidence: ' + event.results[i][0].confidence);
    i++;
}

recognition.onspeechend = function () {
    recognition.stop();
}

recognition.onerror = function (event) {
    outputDOM.textContent = 'Tanımada hata oldu: ' + event.error;
}
