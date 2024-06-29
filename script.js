var index = 0;
var data;   // it contains the collection of all the questions
var total = 0;
var same_question;
var opbtn1;
var opbtn2;
var opbtn3;
var opbtn4;
var interval;   // it contains the id returned by the setInterval function
var time;    // for the timer 
var category;
var besttopic;
var maxtotal;

const nextbtn = document.querySelector(".nextbtn");
const rulescontainer = document.querySelector(".rules-container");   // to get the first element with the class name = "rules-container"
const startbtn = document.querySelector(".startbtn");
const questionscontainer = document.querySelector(".questions-container");
const points_container = document.querySelector(".points-container");
const point_text = document.querySelector(".point-text");

let besttpc = localStorage.getItem('besttopic');
let maxttl = localStorage.getItem('maxtotal');
if(besttpc !== null && maxttl !== null){
  document.querySelector(".winner-details").style.display = "flex";
  document.querySelector('.besttopic').innerText = besttpc;
  document.querySelector('.maxtotal').innerText = maxttl;
}

const hideheader = () => { 
  // hiding the header and displaying the rules-container
  nextbtn.parentElement.parentElement.classList.add("hide");
  rulescontainer.classList.remove("hide");
  rulescontainer.classList.add("w3-animate-top");
};


const hiderules = () => {
  if(!category){
    alert("Please Select a Categpry");
    return;
  }
  const api_url = `https://quizapi.io/api/v1/questions?apiKey=Ki3fX8OZk4uB81gflPqhJAA9kyp0bdOuRnsyyTNm&limit=10&tags=${category}`;
  startbtn.parentElement.parentElement.parentElement.classList.add("hide");
  questionscontainer.classList.remove("hide");
  getdata(api_url);
};


async function getdata(url) {
  const response = await fetch(url);
  data = await response.json();
  nextquestion();
}


const starttimer = () => {
  interval = setInterval(() => {
    time -= 1;
    if (time == 0) {
      nextquestion();
    }
  }, 1000);
};

const nextquestion = () => {
  time = 11;
  if (index < 10) {
    clearInterval(interval);
    starttimer();
  }

  if (index >= 10) {
    besttopic = localStorage.getItem('besttopic');
    maxtotal = localStorage.getItem('maxtotal');
    if(besttopic && parseInt(maxtotal)){
      if(total > parseInt(maxtotal)){
        localStorage.removeItem('besttopic');
        localStorage.removeItem('maxtotal');
        localStorage.setItem('besttopic' , String(category));
        localStorage.setItem('maxtotal', String(total));
      }
    }
    else{
      besttopic = category;
      maxtotal = total;
      localStorage.setItem('besttopic' , String(besttopic));
      localStorage.setItem('maxtotal', String(maxtotal));
    }

    questionscontainer.classList.add("hide");
    points_container.classList.remove("hide");
    points_container.classList.add("w3-animate-zoom");

    point_text.innerText = "You have scored "+ total + " Points";
    return;
  }

  index++;
  same_question = false;

  //for dynamic creation of the questions, first delete all the contents of the question-container
  const questions_container_html = document.querySelector(".questions-container");
  questions_container_html.innerHTML = "";

  var questions_container = document.querySelector(".questions-container");

  //dynamically creating the container for the new question
  var question_box = document.createElement("div");
  question_box.classList.add("question-box");
  question_box.classList.add("w3-animate-top");
  questions_container.appendChild(question_box);

  var timer = document.createElement("div");
  timer.classList.add("timer");

  // for every second it updates the time, the time is allready being updated each second by the start-timer function
  setInterval(() => {
    timer.innerText = time;
  }, 1000);

  question_box.appendChild(timer);

  const questions = document.createElement("div");
  questions.classList.add("questions");
  question_box.appendChild(questions);

  if (data) {
    const main_question = document.createElement("p");
    main_question.classList.add("main-question");
    questions.appendChild(main_question);

    const options = document.createElement("div");
    options.classList.add("options");
    questions.appendChild(options);

    main_question.innerText = index + ") " + data[index - 1].question;

    // if there is an element at option a, create a option there
    if (data[index - 1].answers.answer_a !== null) {
      opbtn1 = document.createElement("button");
      opbtn1.innerText = data[index - 1].answers.answer_a;
      opbtn1.classList.add("option-1");
      opbtn1.onclick = () => {
        calculate("1", opbtn1);
      };
      options.appendChild(opbtn1);
    }

    if (data[index - 1].answers.answer_b !== null) {
      opbtn2 = document.createElement("button");
      opbtn2.innerText = data[index - 1].answers.answer_b;
      opbtn2.classList.add("option-2");
      opbtn2.onclick = () => {
        calculate("2", opbtn2);
      };
      options.appendChild(opbtn2);
    }

    if (data[index - 1].answers.answer_c !== null) {
      opbtn3 = document.createElement("button");
      opbtn3.innerText = data[index - 1].answers.answer_c;
      opbtn3.classList.add("option-3");
      opbtn3.onclick = () => {
        calculate("3", opbtn3);
      };
      options.appendChild(opbtn3);
    }

    if (data[index - 1].answers.answer_d !== null) {
      opbtn4 = document.createElement("button");
      opbtn4.innerText = data[index - 1].answers.answer_d;
      opbtn4.classList.add("option-4");
      opbtn4.onclick = () => {
        calculate("4", opbtn4);
      };
      options.appendChild(opbtn4);
    }
    
    const next_question = document.createElement("div");
    next_question.classList.add("next-question");

    questions_container.appendChild(next_question);

    const nextq_btn = document.createElement("button");
    nextq_btn.classList.add("nextq-btn");
    if (index <= 9) {
      nextq_btn.innerText = "Next Question";
    } else {
      nextq_btn.innerText = "Submit";
    }
    nextq_btn.onclick = nextquestion;
    next_question.appendChild(nextq_btn);
  }
};

const calculate = (user_choice, button) => {
  // if the user has clicked a button but it was previously clicked also, then deselct it first
  if (opbtn1 && opbtn1.classList.contains("choosen")) {
    opbtn1.classList.remove("choosen");
  } else if (opbtn2 && opbtn2.classList.contains("choosen")) {
    opbtn2.classList.remove("choosen");
  } else if (opbtn3 && opbtn3.classList.contains("choosen")) {
    opbtn3.classList.remove("choosen");
  } else if (opbtn4 && opbtn4.classList.contains("choosen")) {
    opbtn4.classList.remove("choosen");
  }

  button.classList.add("choosen");


  // converting the correctness of all the options of the question in the forn= of a object
  const answeris = Object.values(data[index - 1].correct_answers)[user_choice - 1];
  if (answeris == "true" && !same_question) {
    total++;
    same_question = true;
  }
  if (answeris == "false" && same_question) {
    total--;
    same_question = null;
  }
  
};

const javascript_btn = document.querySelector(".cjs");
const html_btn = document.querySelector(".chtml");
const kubernetes_btn = document.querySelector(".ckubernetes");
const docker_btn = document.querySelector(".cdocker");

javascript_btn.onclick = () => {
  highlight_cate();
  category = "javascript";
  javascript_btn.classList.add("choosen");
};

html_btn.onclick = () => {
  highlight_cate();
  category = "html";
  html_btn.classList.add("choosen");
};

kubernetes_btn.onclick = () => {
  highlight_cate();
  category = "kubernetes";
  kubernetes_btn.classList.add("choosen");
};

docker_btn.onclick = () => {
  highlight_cate();
  category = "docker";
  docker_btn.classList.add("choosen");
};

const highlight_cate = () => {
  if (javascript_btn && javascript_btn.classList.contains("choosen")) {
    javascript_btn.classList.remove("choosen");
  } else if (html_btn && html_btn.classList.contains("choosen")) {
    html_btn.classList.remove("choosen");
  } else if (kubernetes_btn && kubernetes_btn.classList.contains("choosen")) {
    kubernetes_btn.classList.remove("choosen");
  } else if (docker_btn && docker_btn.classList.contains("choosen")){
      docker_btn.classList.remove("choosen");
  }
};
