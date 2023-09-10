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

/*
    When dynamically populating list, add this:
    <li class="element-progression-incomplete">
        <div class="element-left"> <!--left side-->
            <i class="fa-solid fa-ellipsis-vertical"></i> <!--to house move icon-->
            <p class="title-progression">Progression Name</p> <!--will be dynamic-->    
        </div>
        <div class="circular-progress"> <!--right side-->
            <span class="progress-value"></span>
        </div>
    </li>
*/

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addProgression(){
    if(inputBox.value === ''){
        alert("You must add text to create a progression.");
    }
    else{
        let li = document.createElement("li");
        li.innerHTML = `<li class="element-progression-incomplete">
        <div class="element-left"> <!--left side-->
            <i class="fa-solid fa-ellipsis-vertical"></i> <!--to house move icon-->
            <p class="title-progression">${inputBox.value}</p> <!--will be dynamic-->    
        </div>
        <div class="circular-progress"> <!--right side-->
            <span class="progress-value"></span>
        </div>
        </li>`;
        listContainer.appendChild(li);
    }

    //clear the text box
    inputBox.value = '';
}
