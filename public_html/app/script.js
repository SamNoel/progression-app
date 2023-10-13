/**
 * TO DO:
 * 
 * --Front end
 * DONE -- Mobile responsiveness (use breakpoints)
 * Convert things to tokens like colors and other styles
 * DONE -- CRUD operations for progressions (add context menu to each item and refactor methods)
 * MOVE functionality for steps and progressions
 * Possibly move icon files to local files (maybe do this later)
 * Login screen
 * Profile tab with overview (maybe change this to Dashboard)
 * 
 * --Back end
 * MySQL DB setup and schema
 * Hosting server (self host -- need to research best options for this)
 * JSON web calls and parsing etc., connecting objects to front end
 * Domain name registration
 * Analytics setup (maybe later)
 * 
 * --Testing
 * Load testing
 * Bug testing
 * Login functionality testing
 * Responsiveness
 * Browser support testing
 */

/**
 * EVENTUALLY:
 * Categories for progressions - these will inform the dashboard data
 */

// window.onload = function(){

// }

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
        this.completedSteps = completedSteps;
        //this.completedSteps = steps.length == 0 ? 0 : steps.filter(x => x.checked == true).length;
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

let progressionArray = [];

//----------------WAIT FOR DOM LOAD-------------------
// window.addEventListener("DOMContentLoaded", () => {
//     main();
// });

// function main(){
    
// }

//----------------VARIABLE DEFINITIONS-------------------
const addProgressionInputBox = document.getElementById("id-active-progression-input-box");
const addStepInputBox = document.getElementById("input-box-step");
const drilldownSection = document.getElementById("id-section-drilldown");
const listContainer = document.getElementById("id-active-progressions-list");
const stepsContainer = document.getElementById("id-steps-list");
const contextMenuWrapper = document.querySelector(".rightclick-menu-wrapper");
const progressionTag = 1;
const stepTag = 2;
var activeProgressionElement = null;
var activeStepElement = null;
var activeProgressionObject = null;
var activeStepObject = null;
var currentTab = null;
var drilldownTitle = document.getElementById("id-drilldown-title");

//----------------HELPERS-------------------
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
};

function toggleActiveMobileNav(){
    let adminSection = document.getElementById("id-section-admin");
    let adminMenu = document.getElementById("id-menu");

    adminSection.classList.toggle("active-mobile");
    adminMenu.classList.toggle("active-mobile");
}

function addContextMenu(listItem, tagType) {
    
    //add the event listener for the context menu
    listItem.addEventListener("contextmenu", e => {
        
        //set the active progression or step when the context menu is shown (right click)
        if(tagType == 1){
            setActiveProgressionValues(listItem.id);
            deactivateStep();
        }
        else if (tagType == 2){
            setActiveStepValues(listItem.id);
        }

        //prevent default context menu on desktop and mobile
        e.preventDefault();
        e.stopPropagation();

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

function setDrilldownContent(){
    let placeholder = document.getElementById("id-drilldown-none-selected");
    let drilldownWrapper = document.getElementById("id-drilldown-wrapper");

    if(activeProgressionElement == null){
        placeholder.style.display = "flex";
        drilldownWrapper.style.display = "none";
    }
    else{
        placeholder.style.display = "none";
        drilldownWrapper.style.display = "block";
    }
}

function setActiveProgressionValues(progressionId){
    activeProgressionElement = document.getElementById(progressionId);
    activeProgressionObject = progressionArray.find(x => x.identifier == progressionId);
}

function setActiveStepValues(stepId){
    activeStepElement = document.getElementById(stepId);
    activeStepObject = activeProgressionObject.steps.find(x => x.identifier == stepId);
}

function resetActiveItems(){
    deactivateProgression();
    deactivateStep();
    setDrilldownContent();
}

function deactivateStep(){
    activeStepElement = null;
    activeStepObject = null;
}

function deactivateProgression(){
    activeProgressionElement = null;
    activeProgressionObject = null;
}

function checkMobileView(){
    let hamburgerMenuDisplay = document.getElementById("id-hamburger-menu");

    if (hamburgerMenuDisplay.style.display != "none"){
        return true;
    }

    // let adminSection = document.getElementById("id-section-admin");
    // if(adminSection.classList.contains("active-mobile")){
    //     return true;
    // }
    
    return false;
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
});

function loadData(){
    //basically just load the active progressions tab data
    let activeProgressionsTab = document.getElementById("id-in-progress-tab");
    getTabData(activeProgressionsTab);
}

//----------------PULL IN CURRENT TAB DATA-------------------
function getTabData(e){
    //if in mobile, set nav menu to inactive
    let adminSection = document.getElementById("id-section-admin");
    if(adminSection.classList.contains("active-mobile")){
        toggleActiveMobileNav();

        if (drilldownSection.classList.contains("active-mobile")){
            drilldownSection.classList.toggle("active-mobile");
        }
    }

    currentTab = e;
    let listContainer = e.closest("ul");

    //reset the active progression
    resetActiveItems();

    //clear the drilldown
    setDrilldownContent();

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
    else if(e.id == "id-dashboard-tab"){
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
        
        li = addContextMenu(li, progressionTag);
    
        //add to the list container (the UL)
        listContainer.appendChild(li);
    });    
}

//----------------PULL IN CURRENT STEPS-------------------
function getProgressionSteps(progressionId){

    if (checkMobileView()){
        drilldownSection.classList.toggle("active-mobile");
        console.log("Mobile drilldown active");
    }

    //set current li to active - CURRENTLY NOT WORKING
    let currentLI = document.getElementById(progressionId);
    currentLI.classList.add("selected");

    //set the active progression
    setActiveProgressionValues(progressionId);

    //display the drilldown
    setDrilldownContent();

    //update the section title
    drilldownTitle.textContent = activeProgressionObject.progressionName;

    //clear the content of the Steps section before populating
    stepsContainer.textContent = "";
    
    if (activeProgressionObject.steps.length > 0){
        //loop through the steps of the current progression and add to the DOM
        activeProgressionObject.steps.forEach((step) => {
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
            li = addContextMenu(li, stepTag);

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

        li = addContextMenu(li, progressionTag);

        listContainer.appendChild(li);
    }

    //clear the text box
    addProgressionInputBox.value = '';
}

//----------------ADD NEW STEP-------------------
function addStep(){
    //make sure there is a currently active progression
    if(activeProgressionObject != null){
        if(addStepInputBox.value === ''){
            alert("You must add text to create a step.");
        }
        else{
            let newStep = new Step(addStepInputBox.value, false, parentIdentifier = activeProgressionObject.identifier);

            //add the step to the active progression
            activeProgressionObject.steps.push(newStep);

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

            li = addContextMenu(li, stepTag);

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
    activeStepElement = e.closest("li");
    activeStepObject = activeProgressionObject.steps.find(x => x.identifier === activeStepElement.id);

    if(activeStepElement.classList.contains("checked")){
        activeStepElement.classList.remove("checked");
        activeStepObject.checked = false;
    }
    else{
        activeStepElement.classList.add("checked");
        activeStepObject.checked = true;
    }

    setCompletionValue();
}

function setCompletionValue(){
    //set values for total and completed steps
    activeProgressionObject.totalSteps = activeProgressionObject.steps.length;
    activeProgressionObject.completedSteps = activeProgressionObject.steps.filter(x => x.checked == true).length;

    console.log("Total Steps: " + activeProgressionObject.totalSteps);
    console.log("Completed Steps: " + activeProgressionObject.completedSteps);

    if(activeProgressionObject.totalSteps != 0 && activeProgressionObject.completedSteps != 0){
        activeProgressionObject.percentComplete = Math.round((activeProgressionObject.completedSteps * 100.0) / activeProgressionObject.totalSteps);
    }
    else{
        activeProgressionObject.percentComplete = 0;
    }

    updateCompletionInUI();
}

function updateCompletionInUI(){
    let progressValue = activeProgressionElement.querySelector(".progress-value");
    let circularProgress = activeProgressionElement.querySelector(".circular-progress");

    progressValue.textContent = `${activeProgressionObject.percentComplete}%`;
    circularProgress.style.background = `conic-gradient(#41A128 ${activeProgressionObject.percentComplete * 3.6}deg, #FFF 0deg)`;
}

//----------------DELETE LIST ITEM-------------------
function deleteListItem(){
    if(activeStepElement != null && activeStepObject != null){
        activeStepElement.remove();

        //remove from array
        activeProgressionObject.steps = activeProgressionObject.steps.filter(x => x.identifier !== activeStepObject.identifier);

        //update completion value
        setCompletionValue();

        //set active step back to null
        deactivateStep();
    }
    else if (activeProgressionElement != null && activeProgressionObject != null){
        activeProgressionElement.remove();

        //remove from array
        progressionArray = progressionArray.filter(x => x.identifier !== activeProgressionObject.identifier);

        //reset the active progression and steps
        resetActiveItems();

        //clear the drilldown
        setDrilldownContent();
    }
}

//----------------DUPLICATE LIST ITEM-------------------
function duplicateListItem(){
    if(activeStepElement != null && activeStepObject != null){
        //clone the element + any child elements in the node tree
        let duplicatedElement = activeStepElement.cloneNode(true);

        //find the matching step
        let originalStep = activeProgressionObject.steps.find(x => x.identifier == activeStepObject.identifier);

        //create a new step from this
        let newStep = new Step(originalStep.stepName, originalStep.checked, originalStep.parentIdentifier);

        //add to the array
        activeProgressionObject.steps.push(newStep);

        //add the context menu
        duplicatedElement = addContextMenu(duplicatedElement, stepTag);

        //update the id on the element to not be a dup of the original
        duplicatedElement.id = newStep.identifier;

        //add to the UI
        stepsContainer.appendChild(duplicatedElement);

        //update completion value
        setCompletionValue();       

        //set active step back to null
        deactivateStep();
    }
    else if (activeProgressionElement != null && activeProgressionObject != null){
        //clone the element + any child elements in the node tree
        let duplicatedElement = activeProgressionElement.cloneNode(true);

        //create a new step from this
        let newProgression = new Progression((activeProgressionObject.progressionName + " copy"), activeProgressionObject.percentComplete, activeProgressionObject.completedSteps);

        duplicatedElement.querySelector("p").textContent = newProgression.progressionName;

        let currentStep = null;

        //add each step to the new object and update ids
        activeProgressionObject.steps.forEach(step => {
            currentStep = new Step(step.stepName, step.checked, newProgression.identifier);
            newProgression.steps.push(currentStep);
        });

        //add to the array
        progressionArray.push(newProgression);

        //add the context menu
        duplicatedElement = addContextMenu(duplicatedElement, progressionTag);

        //update the id on the element to not be a dup of the original
        duplicatedElement.id = newProgression.identifier;

        //add to the UI
        listContainer.appendChild(duplicatedElement);

        //update completion value
        setCompletionValue();       

        //reset active items
        resetActiveItems();

        console.log("New progression steps length: " + newProgression.steps.length);
    }
}

//----------------EDIT LIST ITEM-------------------
function editListItem(){
    console.log("Active Step: " + activeStepObject);
    console.log("Active Progression: " + activeProgressionObject.progressionName);

    if(activeStepElement != null && activeStepObject != null){
        console.log("Active step ID: " + activeStepElement.id);
        console.log("Active progression steps: " + activeProgressionObject.steps);

        //get the step name (p tag) of the active step and set contentEditable to true
        let node = activeStepElement.querySelector(".title-step");
        node.contentEditable = true;

        //find the step in the array
        let originalStep = activeProgressionObject.steps.find(x => x.identifier == activeStepElement.id);

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
                deactivateStep();
            }
        });  
    }
    else if (activeProgressionElement != null && activeProgressionObject != null){
        //get the step name (p tag) of the active step and set contentEditable to true
        let node = activeProgressionElement.querySelector(".title-progression");
        node.contentEditable = true;

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
                activeProgressionObject.progressionName = node.textContent;
                drilldownTitle.textContent = node.textContent;
            }
        });
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

function closeDrilldown(){
    console.log("Close working");

    if (drilldownSection.classList.contains("active-mobile")){
        console.log("Drilldown active");
        drilldownSection.classList.remove("active-mobile");
    }

    //reset the active progression
    resetActiveItems();

    //clear the drilldown
    setDrilldownContent();
}