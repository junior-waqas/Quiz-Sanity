
const body = document.querySelector('body')
const categoryOptions=document.querySelector(".category-options")
const difficultyLevels=document.querySelector(".difficulty-levels")
const startQuiz=document.querySelector(".submit-button")
const categoriesPara=document.querySelector('.categories')
const difficultitesPara=document.querySelector(".difficulties")
const quizChosingSec=document.querySelector('.quiz-choosing')
const quizAttemptingSec=document.querySelector(".quiz-sec")
const scoreboardSec=document.querySelector(".scoreboard-sec")
// quiz sec

const questionNumber=document.querySelector(".question-num")
const question=document.querySelector('.question')
const choice1=document.querySelector(".c1")
const choice2=document.querySelector(".c2")
const choice3=document.querySelector(".c3")
const choice4=document.querySelector(".c4")

const choicesArray =[choice1,choice2,choice3,choice4]


const choices=document.querySelector(".choices")

const currentQuestionNum=document.querySelector(".current-question-num")
const totalQuestionNum=document.querySelector(".total-question-num")
const timeDisplay=document.querySelector('.time-value')
const nextButton=document.querySelector('.next-btn')

const resultSec=document.querySelector(".result-page ")
const welcomeSec=document.querySelector('.welcome-sec')
const celebrationBox=document.querySelector('.celebration-box')
const celebrationImg=document.querySelector(".clebration-img")
const correctDisplay=document.querySelector('.correct-display')
const totalDisplay=document.querySelector('.total-display')
const quitQuizBtn=document.querySelector('.quit-quiz')
const userNameField=document.querySelector(".user-name-field")
const nameSubmitBtn=document.querySelector(".name-submit")
const scoreBoardBtn=document.querySelector('.scoreboard-btn ')
const scoresBox=document.querySelector('.scores')
const scoreBoardBackBtn=document.querySelector('.scoreboard-back-btn ')
let userName=''
let allUsers

let startTime=15
let totalScore=0 
let questionNumbers
let correctAnswer
let selectedAnswer
let selectedCategory=''
let selectedDifficulty=''
let interval 
let allchoicesArray
let quizData;
let totalQuestions;
let startingIndex=0


//  load users data when dom loads 



// user name input evnet
userNameField.addEventListener('input',(event)=>{
    userName=userNameField.value
})

// name sbumit logic 

nameSubmitBtn.addEventListener('click',(event)=>{
  if(userNameField.value.trim() !== ""){
    welcomeSec.classList.add('hidden')
    quizChosingSec.classList.remove('hidden')
  }
  else{
    alert('Please enter your Name!')
  }
})

// scoreboard button 

scoreBoardBtn.addEventListener('click',(event)=>{
  welcomeSec.classList.add('hidden')
  scoreboardSec.classList.remove('hidden')
  
  displayUsers()
})

// going back grom scoreboard

scoreBoardBackBtn.addEventListener('click',(event)=>{
  welcomeSec.classList.remove('hidden')
  scoreboardSec.classList.add('hidden')
})





// quiz choosing sec stuff 

quizChosingSec.addEventListener('click',async(event)=>{
  //category drop down logic 
  if(event.target.classList.contains('categories')){
    difficultyLevels.style.display='none'
   if(categoryOptions.style.display==='flex'){
     categoryOptions.style.display='none'

   }
   else{
     categoryOptions.style.display='flex'
     
   }
 }

 // selecting difficultites 

 if(event.target.classList.contains('difficulties')){
   categoryOptions.style.display='none'
   if(difficultyLevels.style.display==='flex'){
     difficultyLevels.style.display='none'

   }
   else{
     difficultyLevels.style.display='flex'
     
   }
 }

 // category selection 
 if(event.target.parentElement.classList.contains('category-options')){
   if(event.target.tagName==='A'){
     selectedCategory=Number(event.target.getAttribute('data-category-number'))
     categoriesPara.textContent=event.target.textContent
      event.target.parentElement.style.display='none'
   }
 }

 //difficulty slection 

 if(event.target.parentElement.classList.contains('difficulty-levels')){
   if(event.target.tagName==='A'){
     selectedDifficulty=event.target.getAttribute("data-difficulty")
    difficultitesPara.textContent=event.target.textContent
     event.target.parentElement.style.display='none'
   }
 }

 if(event.target.classList.contains('submit-button')){
      event.preventDefault()
      questionNumbers= Number(document.querySelector(".num-question").value)
      if(questionNumbers>50){
        alert('Please enter number of questions between 0 and 50')
      }
      else{

      quizData=await quizFetcher(selectedCategory, selectedDifficulty, questionNumbers)
      totalQuestions=quizData.results.length
      totalQuestionNum.textContent=totalQuestions
      quizChosingSec.classList.add('hidden')
      quizAttemptingSec.classList.remove('hidden')

     // calling quiz filled as soon quiz attemp sec loads 
     console.log(startingIndex)
     quizFiller()
     
     updateCountDownDisplay(startTime)
     startTimer() //starting the timer after loading frist questoin

     // after every sec timer is updated and if timer is 15 sec we head onto the next question 
      }
}
})


// quiz attempting sec 
choices.addEventListener('click',(event)=>{
  // option selection 
  if(event.target.tagName==="P"){
   clearInterval(interval)
   selectedAnswer=event.target.textContent
   choices.style.pointerEvents='none'
   //if answer is correct
   if(selectedAnswer==correctAnswer){
     event.target.classList.add('correct')
     totalScore++
   }
  //  if answer is incorect

   else{
     event.target.classList.add('inccorect')
      allchoicesArray=[...choices.children]
     let siblings = allchoicesArray.filter((child)=>{
       return child!==event.target 
     })

     // making the correct option green
     siblings.forEach((sibling)=>{
       if(sibling.textContent==correctAnswer){
         sibling.classList.add('correct')
       }
     })

   }
  }
})
// pressing next button 
nextButton.removeEventListener('click',nextButtonHandler);
nextButton.addEventListener('click',nextButtonHandler);


// result sec 

resultSec.addEventListener('click',(event)=>{
  if(event.target === quitQuizBtn){
    resultSec.classList.add('hidden')
    welcomeSec.classList.remove('hidden')
    //resetting values 
    startingIndex=0 
    startTime=15
    totalScore=0
    clearInterval(interval)
    userToLocalStorage(userName,totalScore)
    

  }
})









    

        
     
      

    




async function quizFetcher(category,difficulty,amount) {
   let baseUrl = `https://opentdb.com/api.php?amount=${amount}&type=multiple`

   if(category){
    baseUrl+=`&category=${category}`
   }
   if(difficulty){
    baseUrl+=`&difficulty=${difficulty}`
   }

   try {
    let res=await fetch(baseUrl)
    let data= await res.json()
    return data 
   } catch (error) {
     console.error('error fetching quiz data',error)
   }
   
}


function quizFiller() {
  
  console.log('quiz filler called ')
  currentQuestionNum.textContent=startingIndex+1
  choicesStyleRestter()

  choices.style.pointerEvents='auto'

  question.innerHTML = quizData.results[startingIndex].question;
  correctAnswer=quizData.results[startingIndex].correct_answer
  let answers = [...quizData.results[startingIndex].incorrect_answers,
  quizData.results[startingIndex].correct_answer];
  
  const shuffledAnswers=fisherYatesShuffle(answers)
  choice1.textContent=shuffledAnswers[0]
  choice2.textContent=shuffledAnswers[1]
  choice3.textContent=shuffledAnswers[2]
  choice4.textContent=shuffledAnswers[3]
  startingIndex++;
  return correctAnswer
}



function updateCountDownDisplay(seconds){
   timeDisplay.textContent=seconds
}


function startTimer(){
  clearInterval(interval);
  interval = setInterval(() => {
    if (startTime > 0) {
      startTime--;
      updateCountDownDisplay(startTime);
    }

    if (startTime === 0) {
      if (startingIndex < totalQuestions) {
        nextButtonHandler(); // Automatically go to the next question when time runs out
      } else {
        // Show results when no more questions are left
        quizAttemptingSec.classList.add('hidden');
        resultSec.classList.remove('hidden');
        correctDisplay.textContent = totalScore;
        totalDisplay.textContent = totalQuestions;
      }
    }
  }, 1000);
}

function choicesStyleRestter(){
  choicesArray.forEach((choice)=>{
    if(choice.classList.contains('correct')){
      choice.classList.remove('correct')
    }
    if(choice.classList.contains('inccorect')){
      choice.classList.remove('inccorect')
    }
    
  })
}

function nextButtonHandler(event) {
  if (startingIndex < totalQuestions) {
    // Allow the timer to continue until either the user answers or the time runs out
    clearInterval(interval); // Clear any running timers
    quizFiller(); // Load the next question
    startTime = 15; // Reset the timer
    updateCountDownDisplay(startTime);
    startTimer(); // Start the timer again for the new question

    // Re-enable choices
    choices.style.pointerEvents = 'auto';
  } else {
    // When it's the last question, show the result screen
    quizAttemptingSec.classList.add('hidden');
    resultSec.classList.remove('hidden');
    correctDisplay.textContent = totalScore;
    totalDisplay.textContent = totalQuestions;
  }
}


function fisherYatesShuffle(array){
  for(let i = array.length-1 ; i>0 ; i--){

    // generate a randome number between 0 and i 
    const j = Math.floor(Math.random()*(i+1));
    // array destructurig for swappign indexes

    [array[i],array[j]]=[array[j],array[i]]
  }
  return array
}


function userToLocalStorage(userName,totalScore) {
  
  // combining score and name in an object 
  let currenUser={
    name:userName,
    score:totalScore
  }
  //  if the users obj doesnt exist create it 
   if(!localStorage.getItem('users')){
    let users = []
    users.push(currenUser)
    localStorage.setItem('users',JSON.stringify(users))
   }
   else{
      let extractedData = JSON.parse(localStorage.getItem('users'))
      extractedData.push(currenUser)
      // setting to local storag
      localStorage.setItem('users',JSON.stringify(extractedData))
   }
}

function getAllUsers(){
    allUsers=JSON.parse(localStorage.getItem('users'))
}

function displayUsers(){
  getAllUsers()
  

  
   
  
 while(scoresBox.firstChild){
  scoresBox.removeChild(scoresBox.firstChild)
 }
   


  allUsers.forEach((user)=>{
    let userBox=document.createElement('div')
    let userNamePara=document.createElement('p')
    let userScorePara=document.createElement('p')
     
    console.log(user.score)
    // filling em
    userNamePara.textContent=user.name
    userScorePara.textContent=user.score
      
    userBox.setAttribute('data-user-name',user.name)
    userBox.classList.add('user-box')
    // appending to userbox and then to leaderboard sec

    userBox.append(userNamePara,userScorePara)
    scoresBox.append(userBox)

  })
}