//----------------OBJECTS-------------------
class Step {
    constructor(stepName, checked = false) {
        this.stepName = stepName;
        this.checked = checked;
    }
}

class Progression {
    constructor(progressionName, category = '', percentComplete, steps = [], identifier = uuidv4()) {
        this.progressionName = progressionName;
        this.category = category;
        this.percentComplete = percentComplete;
        this.steps = steps;
        this.identifier = identifier;
    }
}

//----------------HELPERS-------------------
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const addProgressionInputBox = document.getElementById("id-active-progression-input-box");
const listContainer = document.getElementById("id-active-progressions-list");
const stepsContainer = document.getElementById("id-steps-list");
let activeProgression = null;
let drilldownTitle = document.getElementById("id-drilldown-title");


//----------------FOR TESTING ONLY----------------
let steps1 = [
    new Step("Step 1"),
    new Step("Step 2"),
    new Step("Step 3")
];

let prog1 = new Progression("Progression 1", '', 65, steps1),
    prog2 = new Progression("Progression 2", '', 0),
    prog3 = new Progression("Progression 3", '', 0),
    prog4 = new Progression("Progression 4", '', 0);

let progressionArray = [
    //prog1,
    //prog2,
    //prog3,
    //prog4
];

//----------------PULL IN CURRENT PROGRESSIONS-------------------
progressionArray.forEach((currentProgression) => {
    let li = document.createElement("li");
        li.innerHTML = `<li class="list-item active-progression-item" id=${currentProgression.identifier} 
        onclick="getProgressionSteps(this.id)">
        <div class="element-left"> <!--left side-->
            <i class="fa-solid fa-ellipsis-vertical"></i> <!--to house move icon-->
            <p class="title-progression">${currentProgression.progressionName}</p>   
        </div>
        <div class="circular-progress" style="background: conic-gradient(#41A128 ${currentProgression.percentComplete * 3.6}deg, #FFF 0deg);"> <!--right side-->
            <span class="progress-value">${currentProgression.percentComplete}%</span>
        </div>
        </li>`;
        listContainer.appendChild(li);
});

//----------------PULL IN CURRENT STEPS-------------------
function getProgressionSteps(progressionId){
    //set current li to active - CURRENTLY NOT WORKING
    let currentLI = document.getElementById(progressionId).classList.add("active");

    //alert("Clicked");
    currentProgression = progressionArray.find(x => x.identifier === progressionId); //get the current progression object from id
    //alert(`current progression has ${currentProgression.steps.length} steps`);
    
    //set the active progression
    activeProgression = currentProgression;

    //update the section title
    drilldownTitle.textContent = currentProgression.progressionName;

    //clear the content of the Steps section before populating
    stepsContainer.textContent = "";
    
    if (currentProgression.steps.length > 0){
            //loop through the steps of the current progression and add to the DOM
    currentProgression.steps.forEach((step) => {
        let li = document.createElement("li");
        li.innerHTML = `
        <li class="list-item step-item">

        <div class="element-left"> <!--left side-->
            <i class="fa-solid fa-ellipsis-vertical"></i> <!--to house move icon-->
            <p class="title-progression">${step.stepName}</p>   
        </div>
        <span class="completion-circle" onclick="checkOffStep(this)"></span>

        </li>`;
        stepsContainer.appendChild(li);
    })
    }
}

//----------------PROGRESS BAR-------------------
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

//----------------ADD PROGRESSION-------------------
var textboxInput = document.getElementById("id-active-progression-input-box");
    textboxInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {  
        addProgression(e);
    }
  });

function addProgression(){
    if(addProgressionInputBox.value === ''){
        alert("You must add text to create a progression.");
    }
    else{
        let newProgression = new Progression(addProgressionInputBox
.value, '', 0);
        //add to the current array
        progressionArray.push(newProgression);

        //add to the UI
        let li = document.createElement("li");
        li.innerHTML = `<li class="list-item active-progression-item" id=${newProgression.identifier} 
        onclick="getProgressionSteps(this.id)">
        <div class="element-left"> <!--left side-->
            <i class="fa-solid fa-ellipsis-vertical"></i> <!--to house move icon-->
            <p class="title-progression">${addProgressionInputBox
    .value}</p> <!--will be dynamic-->    
        </div>
        <div class="circular-progress" style="background: conic-gradient(#41A128 ${newProgression.percentComplete * 3.6}deg, #FFF 0deg);"> <!--right side-->
            <span class="progress-value">${newProgression.percentComplete}%</span>
        </div>
        </li>`;
        listContainer.appendChild(li);
    }

    //clear the text box
    addProgressionInputBox.value = '';
    //alert(`the current array has ${progressionArray.length} items.`);
}

//----------------ADD NEW STEP-------------------
var textboxInputStep = document.getElementById("input-box-step");
const listStepContainer = document.getElementById("id-steps-list");
textboxInputStep.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {  
        addStep(e);
    }
  });

function addStep(){
    //make sure there is a currently active progression
    if(activeProgression != null){
        if(textboxInputStep.value === ''){
            alert("You must add text to create a step.");
        }
        else{
            let newStep = new Step(textboxInputStep.value, false)

            //add the step to the active progression
            activeProgression.steps.push(newStep);

            //populate the DOM
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
    else{
        alert("Please select a progression before adding a step.");
        textboxInputStep.value = '';
    }
}

//----------------COMPLETE A STEP-------------------
function checkOffStep(e){
    $(e).parent().toggleClass("checked");
}