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

//----------------WAIT FOR DOM LOAD-------------------
// window.addEventListener("DOMContentLoaded", () => {
//     main();
// });

// function main(){
    
// }

//----------------VARIABLE DEFINITIONS-------------------
const addProgressionInputBox = document.getElementById("id-active-progression-input-box");
const addStepInputBox = document.getElementById("input-box-step");
const listContainer = document.getElementById("id-active-progressions-list");
const stepsContainer = document.getElementById("id-steps-list");
const contextMenuWrapper = document.querySelector(".rightclick-menu-wrapper");
var activeProgression = null;
var activeStep = null;
var currentTab = null;
var drilldownTitle = document.getElementById("id-drilldown-title");

//----------------HELPERS-------------------
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
};

function addContextMenu(listItem) {
    
    //add the event listener for the context menu
    listItem.addEventListener("contextmenu", e => {
        
        //set the active step when the context menu is shown (right click)
        activeStep = document.getElementById(listItem.id);

        //prevent default context menu
        e.preventDefault();

        //set menu location to wherever the mouse is
        let x = e.clientX, y = e.clientY;
        winWidth = window.innerWidth;
        winHeight = window.innerHeight;
        cmWidth = contextMenuWrapper.offsetWidth;
        cmHeight = contextMenuWrapper.offsetHeight;

        //account for menu being cut off by viewport and readjust location
        x = x > winWidth - cmWidth ? winWidth - cmWidth : x;
        y = y > winHeight - cmHeight ? winHeight - cmHeight : y;

        contextMenuWrapper.style.left = `${x}px`;
        contextMenuWrapper.style.top = `${y}px`;
        contextMenuWrapper.style.visibility = "visible";
        contextMenuWrapper.style.height = "auto";
    });

    return listItem;
};

function setDrilldownPlaceholder(){
    let placeholder = document.getElementById("id-drilldown-none-selected");
    let drilldownWrapper = document.getElementById("id-drilldown-wrapper");

    if(activeProgression == null){
        placeholder.style.display = "flex";
        drilldownWrapper.style.display = "none";
    }
    else{
        placeholder.style.display = "none";
        drilldownWrapper.style.display = "block";
    }
}

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

document.addEventListener("click", () => {
    contextMenuWrapper.style.visibility = "hidden";

    //disable step editing if click
    // if(activeStep != null){
    //     activeStep.contentEditable = false;
    //     //activeStep = null;
    // }
});

function loadData(){
    //basically just load the active progressions tab data
    let activeProgressionsTab = document.getElementById("id-in-progress-tab");
    getTabData(activeProgressionsTab);
}

//----------------PULL IN CURRENT TAB DATA-------------------
function getTabData(e){
    currentTab = e;
    let listContainer = e.closest("ul");

    //reset the active progression
    activeProgression = null;

    //clear the drilldown
    setDrilldownPlaceholder();

    //clear the "active" class from all first
    let childElements = listContainer.querySelectorAll(".menu-item");
    childElements.forEach(item => {
        item.classList.remove("active");
    });

    if(e.id == "id-in-progress-tab"){
        e.classList.add("active");
        getProgressions("incomplete");
    }
    else if(e.id == "id-completed-tab"){
        e.classList.add("active");
        getProgressions("complete");
    }
    else if(e.id == "id-profile-tab"){
        e.classList.add("active");
    }
    else if(e.id == "id-logout-tab"){
        e.classList.add("active");
    }
}

//----------------PULL IN PROGRESSIONS-------------------
function getProgressions(category){
    let progressionSubset = null;
    let mainTitle = document.getElementById("id-main-section-title");
    let stepsTitle = document.getElementById("id-drilldown-title");
    let newProgressionForm = document.getElementById("id-new-progression-form");

    if(category == "complete"){
        progressionSubset = progressionArray.filter(x => x.percentComplete == 100);
        mainTitle.textContent = "Completed Progressions";
        stepsTitle.textContent = "";
        newProgressionForm.style.display = "none";
    }
    else if (category == "incomplete"){
        progressionSubset = progressionArray.filter(x => x.percentComplete != 100);
        mainTitle.textContent = "Current Progressions";
        stepsTitle.textContent = "";
        newProgressionForm.style.display = "flex";
    }

    //clear the containers
    listContainer.innerHTML = "";
    stepsContainer.innerHTML = "";

    progressionSubset.forEach((currentProgression) => {
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
}

//----------------PULL IN CURRENT STEPS-------------------
function getProgressionSteps(progressionId){

    //set current li to active - CURRENTLY NOT WORKING
    let currentLI = document.getElementById(progressionId);
    currentLI.classList.add("selected");

    //set the active progression
    activeProgression = progressionArray.find(x => x.identifier === progressionId);

    //display the drilldown
    setDrilldownPlaceholder();

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
                <i class="fa-solid fa-ellipsis-vertical style="color: #ffffff;"></i> <!--to house move icon-->
                <p class="title-step">${step.stepName}</p> <!--will be dynamic-->    
            </div>
            <span class="completion-circle" onclick="checkOffStep(this)"></span>`;

            //add the context menu for right click
            li = addContextMenu(li);

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
                <i class="fa-solid fa-ellipsis-vertical style="color: #ffffff"></i> <!--to house move icon-->
                <p class="title-step">${newStep.stepName}</p> <!--will be dynamic-->    
            </div>
            <span class="completion-circle" onclick="checkOffStep(this)"></span>
            `;

            li = addContextMenu(li);

            stepsContainer.appendChild(li);

            //calculate new completion percentage
            setCompletionValue();
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
    //get the closest li element (basically finds the parent li - the step element)
    let stepElement = e.closest("li");
    let stepObj = activeProgression.steps.find(x => x.identifier === stepElement.id);

    if(stepElement.classList.contains("checked")){
        stepElement.classList.remove("checked");
        stepObj.checked = false;
    }
    else{
        stepElement.classList.add("checked");
        stepObj.checked = true;
    }

    setCompletionValue();
}

function setCompletionValue(){
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

    // let activeProgressionElement = document.getElementById(activeProgression.identifier);

    // console.log("This is working");
    // console.log("Current tab: " + currentTab.id);
    // console.log("Percent complete: " + activeProgression.percentComplete);

    // //if 100%, move to Completed tab
    // if(currentTab != null && currentTab.id == "id-in-progress-tab" && activeProgression.percentComplete == 100){
    //     listContainer.remove(activeProgressionElement);
    // }
    // else if(currentTab != null && currentTab.id == "id-completed-tab" && activeProgression.percentComplete != 100){
    //     listContainer.remove(activeProgressionElement);
    // }
}

function updateCompletionInUI(){
    let progressionElement = document.getElementById(activeProgression.identifier);
    let progressValue = progressionElement.querySelector(".progress-value");
    let circularProgress = progressionElement.querySelector(".circular-progress");

    progressValue.textContent = `${activeProgression.percentComplete}%`;
    circularProgress.style.background = `conic-gradient(#41A128 ${activeProgression.percentComplete * 3.6}deg, #FFF 0deg)`;
}

//----------------DELETE A STEP-------------------
function deleteStep(){
    if(activeStep != null){
        activeStep.remove();

        //remove from array
        activeProgression.steps = activeProgression.steps.filter(x => x.identifier !== activeStep.id);

        //update completion value
        setCompletionValue();

        //set active step back to null
        activeStep = null;
    }
}

//----------------DUPLICATE A STEP-------------------
function duplicateStep(){
    if(activeStep != null){
        //clone the element + any child elements in the node tree
        let duplicatedElement = activeStep.cloneNode(true);

        //find the matching step
        let originalStep = activeProgression.steps.find(x => x.identifier == activeStep.id);

        //create a new step from this
        let newStep = new Step(originalStep.stepName, originalStep.checked, originalStep.parentIdentifier);

        //add to the array
        activeProgression.steps.push(newStep);

        //add the context menu
        duplicatedElement = addContextMenu(duplicatedElement);

        //update the id on the element to not be a dup of the original
        duplicatedElement.id = newStep.identifier;

        //add to the UI
        stepsContainer.appendChild(duplicatedElement);

        //update completion value
        setCompletionValue();       

        //set active step back to null
        activeStep = null;
    }
}

//----------------EDIT A STEP-------------------
function editStep(){
    if(activeStep != null){

        //get the step name (p tag) of the active step and set contentEditable to true
        let node = activeStep.querySelector(".title-step");
        node.contentEditable = true;

        //find the step in the array
        let originalStep = activeProgression.steps.find(x => x.identifier == activeStep.id);

        //select the text upon edit
        if(window.getSelection){
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(node);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        //listen for "enter" keystroke and update only when this happens
        node.addEventListener(["keydown"], (e) => {
            if(e.keyCode == 13){
                //set contentEditable back to false
                node.contentEditable = false;

                //update the name of the step in the array
                originalStep.stepName = node.textContent;

                //set active step back to null (deactivate the step)
                activeStep = null;
            }
        });  

        // document.addEventListener(["click"], (e) => {

        //     activeStep.contentEditable = false;

        //     //update the name of the step in the array
        //     originalStep.stepName = activeStep.querySelector(".title-step").textContent;

        //     //set active step back to null
        //     //activeStep = null;
            
        // }); 

    }
}

// function disableEdits(){
//     console.log(activeStep);
//     console.log(activeStep.contentEditable);
//     if(activeStep != null && activeStep.contentEditable == true){
//         console.log(activeStep);
//         activeStep.contentEditable = false;

//         let originalStep = activeProgression.steps.find(x => x.identifier == activeStep.id);

//         //update the name of the step in the array
//         originalStep.stepName = activeStep.querySelector(".title-step").textContent;
//     }
// }