/*
 * Import packages
 */
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const { response } = require("express");
const { isTypedArray } = require('util/types');
const port = process.env.PORT || 5000;
const io = new Server(server);
let currentquestion_index = 1;
let hardfallbackcounter=0;
const acidic_questions = ["Do you experience heartburn or a burning sensation in your chest or throat?",
  "Do you have regurgitation or a sour taste in your mouth, especially after eating or lying down?",
  "Have you noticed an increase in belching or burping?",
  "Do you frequently experience stomach pain or discomfort?",
  "Do you have difficulty swallowing or feel like food gets stuck in your throat?",  "Have you noticed any changes in your appetite, such as a decrease or increase in food intake?",

  "Have you experienced unexplained weight loss?",
  "Do you frequently cough, especially at night?",
  "Have you noticed any changes in your bowel movements, such as diarrhea or constipation?",
  "Do you have a history of ulcers or gastrointestinal bleeding?",
  "Have you taken any medications, such as nonsteroidal anti-inflammatory drugs (NSAIDs) or aspirin, which can contribute to acid-related problems?",
  "Have you made any dietary or lifestyle changes recently?",
  "Do you consume alcohol, caffeine, or acidic foods and beverages regularly?",
  "Have you experienced any stress or emotional factors that could be contributing to your symptoms?",
  "Do you have a family history of acid-related conditions?",
  "Have you noticed an increase in the frequency of hiccups?",
  "Do you often feel bloated or excessively full after meals?",
  "Have you experienced chest pain or discomfort, especially after eating large meals?",
  "Do you have a persistent sore throat or hoarseness?",
  "Have you noticed an increase in the production of saliva or excessive drooling?",
  "Do you frequently experience nausea or vomiting, especially after meals?",
  "Have you noticed a metallic or bitter taste in your mouth?",
  "Do you have a chronic cough that doesn't seem to be related to any respiratory condition?",
  "Have you experienced difficulty in breathing or shortness of breath, especially when lying down?",
  'Acidic Stomach. Take an Omeprazole or Antacid. [Type "End" if you are satisfied or type "Hi" to start again]'
]

const keywordResponses = {
hello:"Hello! I m really glad that  you have chosen my service in your tough time. Please bear with me for thorough inspection to deduce your problem.Are you having a stomach ache,headache,runny nose,cold,pain in certain body parts etc",
  bye: "Goodbye! Have a great day!",
  hi:"Hello! I m really glad that  you have chosen my service in your tough time. Please bear with me for thorough inspection to deduce your problem.Are you having a stomach ache,headache,runny nose,cold,pain in certain body parts etc",
  no: 'Okay',
  yes: 'Okay I see',
  problem: 'oh okay',
  name: 'what is your age?',
  age: 'What is your profession',
  profession: 'What was the last meal you had',
  daal: 'how spicy was it[very hot,medium,mild]',
  data: 'what should i do next',
  hot: 'Take an omeprazole',

  fever: 'Acetaminophen or Ibuprofen',
  'moderate pain': 'Acetaminophen (Paracetamol)',
  'inflammation': 'Ibuprofen',
  'severe pain': 'Morphine',
  acidic: 'Omeprazole',
  headache:'We dont have the necessary data to assess the condition,This will be upadated soon',
  cold:'We dont have the necessary data to assess the condition,This will be upadated soon',
  pain:'We dont have the necessary data to assess the condition,This will be upadated soon',
  cold:'We dont have the necessary data to assess the condition,This will be upadated soon',
  'runny nose':'We dont have the necessary data to assess the condition,This will be upadated soon',
  Antibiotics: 'Amoxicillin: Used to treat bacterial infections.\n' +
    'Azithromycin: Used for respiratory tract infections, skin infections, and sexually transmitted diseases.' +
    'Ciprofloxacin: Used for urinary tract infections, respiratory tract infections, and certain gastrointestinal infections',
  Analgesics_Pain_Relievers: 'Acetaminophen (Paracetamol): Used for mild to moderate pain and fever.' +
    'Ibuprofen: Used for pain, inflammation, and fever.\n' +
    'Morphine: Used for severe pain.',
  Antidepressants: 'Fluoxetine: Used to treat depression, anxiety disorders, and obsessive-compulsive disorder',
  'stomach ache': ` I m really sorry to hear that.Please bear with me for me to assess and reach a solution `,
  end:'Thank you,take care and do as you are being told,dont hesitate to use my service again'

  // Add more keywords and responses as needed
};

const entries = Object.entries(keywordResponses)
const answers_users = []

let currentSickness;


server.listen(port, function() {
  console.log("server started at port 5000");
});

app.use(express.static('public'));

io.on("connection", (socket) => {
  console.log(`connect ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`disconnect ${socket.id} due to ${reason}`);
  });


  socket.on("question", (data) => {
    console.log("recieved question: " + data)

    answers_users.push(data)
    console.log(answers_users)

    // Convert the question to lowercase for case-insensitive matching
    var question = data.toLowerCase();

    // Look for keywords in the question
    let answer;

    entries.forEach((keyword) => {
        if (question.includes(keyword[0])) {
          answer = keyword[1];
        }
      });

    if (answer === undefined) {
      answer = "Sorry, I didn't understand. Can you please be more relevant to the question asked";
    }

    socket.emit("answer", answer)
      // Reset to the first question if hardfallbackcounter is 5
   if (hardfallbackcounter === 5) {
      currentquestion_index = 1;
      hardfallbackcounter = 0;
      const helloQuestion = "Hello! I'm really glad that you have chosen my service in your tough time. Please bear with me for thorough inspection to deduce your problem. Are you having a stomach ache, headache, runny nose, cold, pain in certain body parts, etc?";
      setTimeout(() => {
      socket.emit("answer", helloQuestion);
    }, 1000);
    return;
  }
    // when user hasn't said the word stomach ache yet
    if (currentSickness === 'stomach ache') {
      stomach_ache()
    }
    if (currentSickness === undefined) {
      if (question.includes('stomach ache')) {
        currentSickness = 'stomach ache'
        stomach_ache()
      }
      else {
        if(currentquestion_index=1)
        currentquestion_index--;
      }
    }

    function stomach_ache() {
      if (!(data.toLowerCase() === 'yes' || data.toLowerCase() === 'no' || data.includes('Hi') || data.includes('End'))) {
        if(currentquestion_index!=0) {
        currentquestion_index--;
        hardfallbackcounter++;
        console.log(currentquestion_index);
          console.log('hardfallbackcounter ' + hardfallbackcounter);

        }
      }
      if ((data.toLowerCase() === 'yes' || data.toLowerCase() === 'no' || data.includes('Hi') || data.includes('End'))||data.includes(keywordResponses)) {
        hardfallbackcounter = 0
      }
      if (currentquestion_index < acidic_questions.length) {
        const nextQuestion = acidic_questions[currentquestion_index];
        currentquestion_index++
        setTimeout(() => {
          socket.emit("answer", nextQuestion);
        }, 1000);

      }
      if(currentquestion_index==acidic_questions.length+1 || data=='End'){
        socket.disconnect()
      }
      if(currentquestion_index==acidic_questions.length+1 || data=='Hi') {
        currentquestion_index=0
        hardfallbackcounter=0;
      }
       

    }

  });

});

