import "./UI/styles/layout.css"
import "./UI/styles/delete-anime.css"
import Reminder from "./javascript/app";

const ADD_FORM = document.querySelector(".add");
const UL = document.querySelector(".todos");
const SEARCH = document.querySelector(".search input");
const REMINDERS = new Reminder(UL);
const THEME = document.querySelector(".theme");
const BACKGROUND = ["#352f5b", "#5b2f2f", "#5b582f", "#345b2f", "#2f5a5b", "#5a2f5b"];
const LI_BACKGROUND = ["#423a6f", "#6f3a3a", "#6f6b3a", "#3a6f3d", "#3a696f", "#6f3a62"];
const ROOT = document.querySelector(":root");
const RESTORE = document.querySelector(".restore");
let themeTracker = 0;

function ulStyleHeight(height, overflow){
    UL.style.height = height;
    UL.style.overflowY = overflow;
}

function heightManagerOne(){
    const CHILD_COUNT = UL.childElementCount;
    if(CHILD_COUNT == 6){
        const HEIGHT = UL.offsetHeight;
        ulStyleHeight(`${HEIGHT}px`, "scroll");
        localStorage.setItem("height", String(HEIGHT));
    }
    return CHILD_COUNT;
}

function searchHeightManager(){
    const ITEM_COUNT = Array.from(UL.children)
        .filter(listItem => !listItem.classList.contains("filtered"))
        .length;

    if(ITEM_COUNT < 7)
        ulStyleHeight("fit-content", "initial");
    else
        ulStyleHeight(`${localStorage.height}px`, "scroll");
}

function heightManagerTwo(){
    if(UL.childElementCount == 7)
        ulStyleHeight("fit-content", "initial");
}

function scrollFunction(childCount){
    if(childCount >= 6)
        UL.scrollTo(0, UL.scrollHeight);
}

function searchEngine(term){
    REMINDERS.filterTodos(term);
    searchHeightManager();
}

//add todos
ADD_FORM.addEventListener("submit", e =>{
    if(Boolean(SEARCH.value)){
        SEARCH.parentElement.reset();
        searchEngine("");
    }

    e.preventDefault();
    const REMINDER = ADD_FORM.add.value.trim();
    if(!REMINDER.length) return 0;

    const CHILD_COUNT = heightManagerOne();
    REMINDERS.generateTemplate(REMINDER);

    scrollFunction(CHILD_COUNT);
    window.scrollTo(0,document.body.scrollHeight);
    ADD_FORM.reset();
    localStorage.setItem("listItems", UL.innerHTML);
});

RESTORE.addEventListener("click", () =>{
    if(RESTORE.classList.contains("in-process")) return 0;
    
    if(!Boolean(SEARCH.value)){
        const CHILD_COUNT = heightManagerOne();
        REMINDERS.restoreListItem();
        scrollFunction(CHILD_COUNT);
    }else{
        REMINDERS.restoreListItem();
        const TERM = SEARCH.value.trim().toLowerCase();
        searchEngine(TERM);
        searchHeightManager();
    }

    localStorage.setItem("listItems", UL.innerHTML);

    if(!REMINDERS.restore.length){
        RESTORE.classList.remove("on");
        RESTORE.classList.add("in-process")
        setTimeout(() => RESTORE.classList.remove("in-process"), 550);
    }
});

//delete todos
UL.addEventListener("click", e =>{
    if(!e.target.classList.contains("delete")) return 0;
    const ITEM = e.target.parentElement;
    if(ITEM.classList.contains("active")) return 0;

    REMINDERS.restoreStack(ITEM);

    if(!Boolean(SEARCH.value.trim()))
        heightManagerTwo();

    ITEM.classList.add("active");
    let time = 1;

    const FADE = setInterval(() =>{
        time -= 0.1;
        ITEM.style.opacity = `${time}`;
    }, 25);

    setTimeout(() =>{
        clearInterval(FADE);
        ITEM.classList.add("pullup");
    }, 250);

    setTimeout(() => {
        ITEM.remove();
        localStorage.setItem("listItems", UL.innerHTML);
        RESTORE.classList.add("on");
        
        if(Boolean(SEARCH.value.trim())){
            searchHeightManager();
        }
    }, 500);
});

//keyup event
//search todos
SEARCH.addEventListener("keyup", (e)=>{
    const TERM = SEARCH.value.trim().toLowerCase();
    searchEngine(TERM);
});

//ADD SUBMIT EVENT
SEARCH
    .parentElement
    .addEventListener("submit", e => e.preventDefault());

//theme contol
THEME.addEventListener("mouseover", () =>{
    const INDEX = (themeTracker + 1) % 6;
    THEME.style.setProperty("background", BACKGROUND[INDEX]);
});

THEME.addEventListener("click", () =>{
    themeTracker++;
    const INDEX = themeTracker % 6;
    if(INDEX === 0) themeTracker = 0;

    ROOT.style.setProperty("--bgColor", BACKGROUND[INDEX]);
    ROOT.style.setProperty("--liBgColor", LI_BACKGROUND[INDEX]);
    THEME.style.setProperty("background", BACKGROUND[(INDEX + 1) % 6]);
    localStorage.setItem("theme", String(themeTracker));
});


THEME.addEventListener("mouseleave", () =>{
    const INDEX = themeTracker % 6;
    THEME.style.setProperty("background", BACKGROUND[INDEX]);
});


// LOADERs
if(localStorage.getItem("theme")){
    themeTracker = Number(localStorage.getItem("theme"));

    const INDEX = themeTracker % 6;
    ROOT.style.setProperty("--bgColor", BACKGROUND[INDEX]);
    ROOT.style.setProperty("--liBgColor", LI_BACKGROUND[INDEX]);
}

if(localStorage.getItem("listItems")){
    UL.innerHTML = localStorage.getItem("listItems");
    searchEngine("");
    if(UL.childElementCount >= 7)
        ulStyleHeight(`${localStorage.height}px`, "scroll");
}
