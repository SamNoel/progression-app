//----------------OBJECTS-------------------
class Step {
    constructor(stepName, checked = false, parentIdentifier = null) {
        this.stepName = stepName;
        this.checked = checked;
        this.identifier = uuidv4();
        this.parentIdentifier = parentIdentifier;
    }
}

class Progression {
    constructor(progressionName, category = '', percentComplete, steps = [], completedSteps = 0) {
        this.progressionName = progressionName;
        this.category = category;
        this.percentComplete = percentComplete;
        this.steps = steps;
        this.identifier = uuidv4();
        this.totalSteps = steps.length;
        this.completedSteps = steps.filter(x => x.checked == true).length;
    }
}

//----------------HELPERS-------------------
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
};

//----------------VARIABLE DEFINITIONS-------------------
const addProgressionInputBox = document.getElementById("id-active-progression-input-box");
const addStepInputBox = document.getElementById("input-box-step");
const listContainer = document.getElementById("id-active-progressions-list");
const stepsContainer = document.getElementById("id-steps-list");
var activeProgression = null;
var drilldownTitle = document.getElementById("id-drilldown-title");

//----------------EVENT LISTENERS-------------------
addProgressionInputBox.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {  
        addProgression(e);
    }
});

addStepInputBox.addEventListener("keydown", function (e) {
if (e.key === "Enter") {  
    addStep(e);
}
});

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
    //create an li for each progression in the array
    let li = document.createElement("li");
    li.classList.add("list-item", "active-progression-item");
    li.setAttribute("id", `${currentProgression.identifier}`);
    li.setAttribute("onclick", "getProgressionSteps(this.id)");
    li.innerHTML = `
        <div class="element-left"> <!--left side-->
            <i class="fa-solid fa-ellipsis-vertical"></i> <!--to house move icon-->
            <p class="title-progression">${currentProgression.progressionName}</p>   
        </div>
        <div class="circular-progress" style="background: conic-gradient(#41A128 ${currentProgression.percentComplete * 3.6}deg, #FFF 0deg);"> <!--right side-->
            <span class="progress-value">${currentProgression.percentComplete}%</span>
        </div>`;

    //add to the list container (the UL)
    listContainer.appendChild(li);
});

//----------------PULL IN CURRENT STEPS-------------------
function getProgressionSteps(progressionId){
    //set current li to active - CURRENTLY NOT WORKING
    let currentLI = document.getElementById(progressionId);
    currentLI.classList.add("selected");

    //set the active progression
    activeProgression = progressionArray.find(x => x.identifier === progressionId);

    //update the section title
    drilldownTitle.textContent = activeProgression.progressionName;

    //clear the content of the Steps section before populating
    stepsContainer.textContent = "";
    
    if (activeProgression.steps.length > 0){
        //loop through the steps of the current progression and add to the DOM
        activeProgression.steps.forEach((step) => {
            let li = document.createElement("li");
            li.classList.add("list-item", "step-item");
            li.setAttribute("id", `${step.identifier}`)
            if (step.checked){
                li.classList.add("checked");
            }

            li.innerHTML = `
            <div class="element-left"> <!--left side-->
                <i class="fa-solid fa-ellipsis-vertical"></i> <!--to house move icon-->
                <p class="title-progression">${step.stepName}</p>   
            </div>
            <span class="completion-circle" onclick="checkOffStep(this)"></span>`;

            stepsContainer.appendChild(li);
        })
    }
}

//----------------PROGRESS BAR-------------------
// let circularProgress = document.querySelector(".circular-progress"),
//     progressValue = document.querySelector(".progress-value");

// let progressStartValue = 0,
//     progressEndValue = 70,
//     speed = 25;

// let progress = setInterval(() => {
//     progressStartValue++;

//     progressValue.textContent = `${progressStartValue}%`;

//     //might need to make this an inline style
//     circularProgress.style.background = `conic-gradient(#41A128 ${progressStartValue * 3.6}deg, #FFF 0deg)`;

//     if(progressStartValue == progressEndValue){
//         clearInterval(progress);
//     }
// }, speed);

//----------------ADD PROGRESSION-------------------
function addProgression(){
    if(addProgressionInputBox.value === ''){
        alert("You must add text to create a progression.");
    }
    else{
        let newProgression = new Progression(addProgressionInputBox.value, '', 0);
        //add to the current array
        progressionArray.push(newProgression);

        //add to the UI
        let li = document.createElement("li");
        li.classList.add("list-item", "active-progression-item");
        li.setAttribute("id", `${newProgression.identifier}`);
        li.setAttribute("onclick", "getProgressionSteps(this.id)")
        li.innerHTML = `
        <div class="element-left"> <!--left side-->
            <i class="fa-solid fa-ellipsis-vertical"></i> <!--to house move icon-->
            <p class="title-progression">${addProgressionInputBox.value}</p> <!--will be dynamic-->    
        </div>
        <div class="circular-progress" style="background: conic-gradient(#41A128 ${newProgression.percentComplete * 3.6}deg, #FFF 0deg);"> <!--right side-->
            <span class="progress-value">${newProgression.percentComplete}%</span>
        </div>`;
        listContainer.appendChild(li);
    }

    //clear the text box
    addProgressionInputBox.value = '';
}

//----------------ADD NEW STEP-------------------
function addStep(){
    //make sure there is a currently active progression
    if(activeProgression != null){
        if(addStepInputBox.value === ''){
            alert("You must add text to create a step.");
        }
        else{
            let newStep = new Step(addStepInputBox.value, false, parentIdentifier = activeProgression.identifier);

            //add the step to the active progression
            activeProgression.steps.push(newStep);

            //populate the DOM
            let li = document.createElement("li");
            li.classList.add("list-item", "step-item");
            li.setAttribute("id", `${newStep.identifier}`);
            li.innerHTML = `
            <div class="element-left"> <!--left side-->
                <i class="fa-solid fa-ellipsis-vertical"></i> <!--to house move icon-->
                <p class="title-progression">${newStep.stepName}</p> <!--will be dynamic-->    
            </div>
            <span class="completion-circle" onclick="checkOffStep(this)"></span>`;

            stepsContainer.appendChild(li);

            //calculate new completion percentage
            setCompletionValue(newStep);
        }
    
        //clear the text box
        addStepInputBox.value = '';
    }
    else{
        alert("Please select a progression before adding a step.");
        addStepInputBox.value = '';
    }
}

//----------------COMPLETE A STEP-------------------
function checkOffStep(e){
    let stepElement = document.getElementById(e.parentNode.id);
    let stepObj = activeProgression.steps.find(x => x.identifier === e.parentNode.id);

    if(stepElement.classList.contains("checked")){
        stepElement.classList.remove("checked");
        stepObj.checked = false;
    }
    else{
        stepElement.classList.add("checked");
        stepObj.checked = true;
    }

    setCompletionValue(stepObj);
}

function setCompletionValue(stepObj){
    //set values for total and completed steps
    activeProgression.totalSteps = activeProgression.steps.length;
    activeProgression.completedSteps = activeProgression.steps.filter(x => x.checked == true).length;

    if(activeProgression.totalSteps != 0){
        activeProgression.percentComplete = Math.round((activeProgression.completedSteps * 100.0) / activeProgression.totalSteps);
    }
    else{
        activeProgression.percentComplete = 0;
    }

    updateCompletionInUI();
}

function updateCompletionInUI(){
    let progressionElement = document.getElementById(activeProgression.identifier);
    let progressValue = progressionElement.querySelector(".progress-value");
    let circularProgress = progressionElement.querySelector(".circular-progress");

    progressValue.textContent = `${activeProgression.percentComplete}%`;
    circularProgress.style.background = `conic-gradient(#41A128 ${activeProgression.percentComplete * 3.6}deg, #FFF 0deg)`;
}