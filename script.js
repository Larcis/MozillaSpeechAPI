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
let current_message_idx = 0;
recognition.onresult = function (event) {
    //console.log(event)
    let current_upper = event.results[current_message_idx][0].transcript.toLocaleUpperCase();
    //console.log(event, current_upper);
    switch (current_upper) {
        case cases[0].toLocaleUpperCase():
            outputDOM.textContent = "";
            current_message_idx++;
            return;
        case cases[1].toLocaleUpperCase():
            window.location = window.location;
            break;
    }

    if (current_message_idx === 0) {
        outputDOM.textContent = "";
    }
    outputDOM.textContent += event.results[current_message_idx][0].transcript;
    console.log('Confidence: ' + event.results[current_message_idx][0].confidence);
    current_message_idx++;
}

recognition.onspeechend = function () {
    recognition.stop();
}

recognition.onerror = function (event) {
    outputDOM.textContent = 'Tanımada hata oldu: ' + event.error;
}

/////// speech synthesis

var synth = window.speechSynthesis;
var inputForm = document.querySelector('form');
var voiceSelect = document.querySelector('select');
var inputTxt = outputDOM;

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');
var voices = [];

function populateVoiceList() {
    voices = synth.getVoices().sort(function (a, b) {
        const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
        if (aname < bname) return -1;
        else if (aname == bname) return 0;
        else return +1;
    });
    var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
    voiceSelect.innerHTML = '';
    for (i = 0; i < voices.length; i++) {
        var option = document.createElement('option');
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

        if (voices[i].default) {
            option.textContent += ' -- DEFAULT';
        }

        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        voiceSelect.appendChild(option);
    }
    voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak() {
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    var utterThis = new SpeechSynthesisUtterance(inputTxt.textContent);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for (i = 0; i < voices.length; i++) {
        if (voices[i].name === selectedOption) {
            utterThis.voice = voices[i];
            break;
        }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
    
}

pitch.onchange = function () {
    pitchValue.textContent = pitch.value;
}

rate.onchange = function () {
    rateValue.textContent = rate.value;
}
voiceSelect.onchange = function(){
  speak();
}
