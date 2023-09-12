class Step {
    constructor(stepName, checked) {
        this.stepName = stepName;
        this.checked = checked;
    }
}

class Progression {
    constructor(progressionName, category, percentComplete) {
        this.progressionName = progressionName;
        this.category = category;
        this.percentComplete = percentComplete;
        //this.step = new Array[Step];
    }
}


//MOVE THIS TO A LOOP FOR EACH PROGRESSION
let circularProgress = document.querySelector(".circular-progress"),
    progressValue = document.querySelector(".progress-value");

let progressStartValue = 0,
    progressEndValue = 70,
    speed = 25;

let progress = setInterval(() => {
    progressStartValue++;

    progressValue.textContent = `${progressStartValue}%`;

    //might need to make this an inline style
    circularProgress.style.background = `conic-gradient(#41A128 ${progressStartValue * 3.6}deg, #FFF 0deg)`;

    if(progressStartValue == progressEndValue){
        clearInterval(progress);
    }
}, speed);


const inputBox = document.getElementById("id-active-progression-input-box");
const listContainer = document.getElementById("id-active-progressions-list");

var textboxInput = document.getElementById("id-active-progression-input-box");
    textboxInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {  
        addProgression(e);
    }
  });

function addProgression(){
    if(inputBox.value === ''){
        alert("You must add text to create a progression.");
    }
    else{
        let newProgression = new Progression(inputBox.value, '', 0);
        let li = document.createElement("li");
        li.innerHTML = `<li class="list-item active-progression-item">
        <div class="element-left"> <!--left side-->
            <i class="fa-solid fa-ellipsis-vertical"></i> <!--to house move icon-->
            <p class="title-progression">${inputBox.value}</p> <!--will be dynamic-->    
        </div>
        <div class="circular-progress" style="background: conic-gradient(#41A128 ${newProgression.percentComplete * 3.6}deg, #FFF 0deg);"> <!--right side-->
            <span class="progress-value">${newProgression.percentComplete}%</span>
        </div>
        </li>`;
        listContainer.appendChild(li);
    }

    //clear the text box
    inputBox.value = '';
}


var textboxInputStep = document.getElementById("input-box-step");
const listStepContainer = document.getElementById("id-steps-list");
textboxInputStep.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {  
        addStep(e);
    }
  });

function addStep(){
    if(textboxInputStep.value === ''){
        alert("You must add text to create a step.");
    }
    else{
        let newStep = new Step(textboxInputStep.value, false)
        let li = document.createElement("li");
        li.innerHTML = `<li class="list-item step-item">

        <div class="element-left"> <!--left side-->
            <i class="fa-solid fa-ellipsis-vertical"></i> <!--to house move icon-->
            <p class="title-progression">${newStep.stepName}</p> <!--will be dynamic-->    
        </div>
        <span class="completion-circle" onclick="checkOffStep(this)"></span>

    </li>`;
        listStepContainer.appendChild(li);
    }

    //clear the text box
    textboxInputStep.value = '';
}


function checkOffStep(e){
    $(e).parent().toggleClass("checked");
}